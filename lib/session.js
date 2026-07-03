/*****************************************************************************
 *                                                                           *
 *                     Developed By STANY TZ                                 *
 *                                                                           *
 *  🌐  GitHub   : https://github.com/Stanytz390                             *
 *  ▶️  YouTube  : https://youtube.com/@STANYTZ                              *
 *  💬  WhatsApp : https://whatsapp.com/channel/0029Vb7fzu4EwEjmsD4Tzs1p     *
 *                                                                           *
 *    © 2026 STANY TZ. All rights reserved.                                 *
 *                                                                           *
 *    Description: Download session credentials from Pastebin or paste.rs   *
 *                 using the custom session ID format:                      *
 *                 stany~bots_<pasteId>                                     *
 *                                                                           *
 ***************************************************************************/

import path from 'path';
import fs from 'fs';
import axios from 'axios';

/**
 * Save credentials from Pastebin/paste.rs to session/creds.json
 * @param {string} customId - Session ID in format "stany~bots_<pasteId>"
 */
async function SaveCreds(customId) {
    // Validate the custom ID format
    if (!customId || !customId.startsWith('stany~bots_')) {
        throw new Error('Invalid session ID format. Expected "stany~bots_<pasteId>"');
    }

    const pasteId = customId.replace('stany~bots_', '');
    if (!pasteId) {
        throw new Error('Missing paste ID');
    }

    // Ensure session directory exists
    const sessionDir = path.join(process.cwd(), 'session');
    if (!fs.existsSync(sessionDir)) {
        fs.mkdirSync(sessionDir, { recursive: true });
    }
    const credsPath = path.join(sessionDir, 'creds.json');

    let success = false;

    // 1. Try Pastebin raw URL first
    const pastebinUrl = `https://pastebin.com/raw/${pasteId}`;
    try {
        const response = await axios.get(pastebinUrl, { timeout: 10000 });
        const data = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
        fs.writeFileSync(credsPath, data);
        console.log('✅ Credentials successfully saved from Pastebin');
        success = true;
    } catch (error) {
        console.log(`⚠️ Pastebin fetch failed: ${error.message}. Trying paste.rs...`);
    }

    // 2. Fallback to paste.rs if Pastebin failed
    if (!success) {
        const pasteRsUrl = `https://paste.rs/${pasteId}`;
        try {
            const response = await axios.get(pasteRsUrl, { timeout: 10000 });
            const data = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
            fs.writeFileSync(credsPath, data);
            console.log('✅ Credentials successfully saved from paste.rs (fallback)');
            success = true;
        } catch (error) {
            console.error(`❌ paste.rs fetch failed: ${error.message}`);
            throw new Error(`Failed to retrieve credentials from any source: ${error.message}`);
        }
    }

    console.log('✅ Credentials file saved to:', credsPath);
}

export default SaveCreds;