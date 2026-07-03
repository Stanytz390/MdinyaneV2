/*****************************************************************************
 *                                                                           *
 *                     Developed By StanyTz                                  *
 *                                                                           *
 *  🌐  GitHub   : https://github.com/Stanytz390                             *
 *  ▶️  YouTube  : https://youtube.com/@Stanytz_tricks                      *
 *  💬  WhatsApp : https://whatsapp.com/channel/0029Vb7fzu4EwEjmsD4Tzs1p    *
 *                                                                           *
 *    © 2026 GlobalTechInfo. All rights reserved.                            *
 *                                                                           *
 *    Description: Download session credentials from Pastebin/paste.rs      *
 *                 using the custom session ID format:                      *
 *                 stany~bots_<pasteId>                                     *
 *                                                                           *
 *****************************************************************************/

import path from 'path';
import fs from 'fs';
import axios from 'axios';

/**
 * Save credentials from Pastebin/paste.rs to session/creds.json
 * @param {string} customId - Session ID in format "stany~bots_<pasteId>"
 */
async function SaveCreds(customId) {
    // 1. Validate the custom ID format
    if (!customId || !customId.startsWith('stany~bots_')) {
        throw new Error('❌ Invalid session ID format. Expected "stany~bots_<pasteId>"');
    }

    const pasteId = customId.replace('stany~bots_', '');
    if (!pasteId || pasteId.length < 5) {
        throw new Error('❌ Invalid paste ID. Please check your session ID.');
    }

    console.log(`📥 Downloading credentials from: ${customId}`);

    // 2. Ensure session directory exists
    const sessionDir = path.join(process.cwd(), 'session');
    if (!fs.existsSync(sessionDir)) {
        fs.mkdirSync(sessionDir, { recursive: true });
    }
    const credsPath = path.join(sessionDir, 'creds.json');

    let downloaded = false;
    let errorMessage = '';

    // 3. Try Pastebin first (primary source)
    const pastebinUrl = `https://pastebin.com/raw/${pasteId}`;
    console.log(`🔍 Trying Pastebin: ${pastebinUrl}`);

    try {
        const response = await axios.get(pastebinUrl, {
            timeout: 15000,
            maxRedirects: 5,
            validateStatus: (status) => status === 200
        });

        // Check if response is valid JSON
        const data = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
        
        // Validate it's proper JSON before saving
        try {
            JSON.parse(data);
        } catch (parseError) {
            throw new Error('Downloaded content is not valid JSON. The paste may contain HTML or an error message.');
        }

        // Write the file
        fs.writeFileSync(credsPath, data);
        console.log('✅ Credentials successfully saved from Pastebin');
        downloaded = true;

    } catch (error) {
        errorMessage = error.message;
        console.log(`⚠️ Pastebin fetch failed: ${error.message}`);

        // Check if the file already exists locally (maybe from previous successful download)
        if (fs.existsSync(credsPath)) {
            try {
                const existingContent = fs.readFileSync(credsPath, 'utf8');
                JSON.parse(existingContent);
                console.log('✅ Using existing credentials from local file');
                return; // Success - exit function
            } catch (e) {
                console.log('⚠️ Local credentials file is corrupted, will try paste.rs...');
            }
        }
    }

    // 4. Fallback to paste.rs if Pastebin failed and we haven't downloaded yet
    if (!downloaded) {
        const pasteRsUrl = `https://paste.rs/${pasteId}`;
        console.log(`🔍 Trying paste.rs (fallback): ${pasteRsUrl}`);

        try {
            const response = await axios.get(pasteRsUrl, {
                timeout: 15000,
                maxRedirects: 5,
                validateStatus: (status) => status === 200
            });

            const data = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);

            // Validate JSON
            try {
                JSON.parse(data);
            } catch (parseError) {
                throw new Error('Downloaded content is not valid JSON.');
            }

            fs.writeFileSync(credsPath, data);
            console.log('✅ Credentials successfully saved from paste.rs (fallback)');
            downloaded = true;

        } catch (error) {
            console.log(`⚠️ paste.rs fetch failed: ${error.message}`);
            errorMessage = error.message;
        }
    }

    // 5. Final verification
    if (!downloaded) {
        // Check if we somehow already have a valid file
        if (fs.existsSync(credsPath)) {
            try {
                const content = fs.readFileSync(credsPath, 'utf8');
                JSON.parse(content);
                console.log('✅ Using existing valid credentials from local file');
                return;
            } catch (e) {
                // File exists but corrupt
                console.log('⚠️ Existing credentials file is corrupt');
            }
        }

        // Try one more time with a different approach - check if the paste might be on a different URL format
        try {
            const altUrl = `https://pastebin.com/raw.php?i=${pasteId}`;
            console.log(`🔍 Trying alternative Pastebin URL: ${altUrl}`);
            const response = await axios.get(altUrl, { timeout: 15000 });
            const data = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
            
            try {
                JSON.parse(data);
                fs.writeFileSync(credsPath, data);
                console.log('✅ Credentials downloaded from alternative Pastebin URL');
                downloaded = true;
            } catch (e) {
                // Still invalid
            }
        } catch (e) {
            // Alternative URL failed
        }
    }

    // 6. Final validation and error reporting
    if (!downloaded) {
        // One last check - maybe the file exists and is valid from a previous run
        if (fs.existsSync(credsPath)) {
            try {
                const content = fs.readFileSync(credsPath, 'utf8');
                JSON.parse(content);
                console.log('✅ Using existing valid credentials');
                return;
            } catch (e) {
                // File is corrupt, delete it
                fs.unlinkSync(credsPath);
            }
        }

        throw new Error(
            `❌ Failed to download credentials.\n\n` +
            `Paste ID: ${pasteId}\n` +
            `Sources tried:\n` +
            `  • Pastebin: ${pastebinUrl}\n` +
            `  • paste.rs: ${pasteRsUrl}\n\n` +
            `Possible causes:\n` +
            `  • The paste ID is incorrect\n` +
            `  • The paste has expired or been deleted\n` +
            `  • The paste doesn't contain valid JSON\n` +
            `  • Network connectivity issues\n\n` +
            `Last error: ${errorMessage}`
        );
    }

    // 7. Final verification after successful download
    try {
        const content = fs.readFileSync(credsPath, 'utf8');
        const parsed = JSON.parse(content);
        
        // Check for required Baileys fields
        if (!parsed.noiseKey || !parsed.signedIdentityKey || !parsed.signedPreKey) {
            throw new Error('Credentials missing required fields: noiseKey, signedIdentityKey, or signedPreKey');
        }

        console.log('✅ Credentials verified successfully');
        console.log(`📊 Session stats:`);
        console.log(`   • File size: ${(fs.statSync(credsPath).size / 1024).toFixed(1)} KB`);
        console.log(`   • Registered: ${parsed.registered || false}`);
        
    } catch (error) {
        console.error(`❌ Credential verification failed: ${error.message}`);
        // Delete corrupt file
        if (fs.existsSync(credsPath)) {
            fs.unlinkSync(credsPath);
        }
        throw new Error(`Credential verification failed: ${error.message}`);
    }
}

export default SaveCreds;