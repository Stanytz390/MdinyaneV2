/*****************************************************************************
 *                                                                           *
 *                     Developed By STANY TZ                                 *
 *                                                                           *
 *  🌐  GitHub   : https://github.com/Stanytz378/iamlegendv2                 *
 *  ▶️  YouTube  : https://youtube.com/@STANYTZ                              *
 *  💬  WhatsApp : https://whatsapp.com/channel/0029Vb7fzu4EwEjmsD4Tzs1p     *
 *                                                                           *
 *    © 2026 STANY TZ. All rights reserved.                                 *
 *                                                                           *
 *    Description: Download session credentials from Pastebin/paste.rs      *
 *                 using custom session ID and save to session/ folder.     *
 *                                                                           *
 ***************************************************************************/

import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import fs from 'fs';
import axios from 'axios';

/**
 * Extracts the paste ID from a custom session string.
 * Expected format: Stanytz378/iamlegendv2_<pasteId>
 * @param {string} txt - Full session identifier
 * @returns {string} The paste ID
 */
function extractPasteId(txt) {
    const parts = txt.split('_');
    // The paste ID is the last part after the last underscore
    return parts[parts.length - 1];
}

/**
 * Attempts to fetch raw content from Pastebin.
 * @param {string} pasteId 
 * @returns {Promise<string|null>}
 */
async function fetchFromPastebin(pasteId) {
    try {
        const url = `https://pastebin.com/raw/${pasteId}`;
        console.log(`[SESSION] Trying Pastebin: ${url}`);
        const response = await axios.get(url, { timeout: 15000 });
        const content = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
        const trimmed = content.trim();
        if (trimmed && (trimmed.startsWith('{') || trimmed.startsWith('['))) {
            console.log(`[SESSION] Pastebin success, length: ${content.length}`);
            return content;
        }
        console.warn('[SESSION] Pastebin returned non‑JSON content');
        return null;
    } catch (error) {
        console.warn(`[SESSION] Pastebin fetch failed: ${error.message}`);
        return null;
    }
}

/**
 * Attempts to fetch raw content from paste.rs.
 * @param {string} pasteId 
 * @returns {Promise<string|null>}
 */
async function fetchFromPasteRs(pasteId) {
    try {
        const url = `https://paste.rs/${pasteId}`;
        console.log(`[SESSION] Trying paste.rs: ${url}`);
        const response = await axios.get(url, { timeout: 15000 });
        const content = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
        const trimmed = content.trim();
        if (trimmed && (trimmed.startsWith('{') || trimmed.startsWith('['))) {
            console.log(`[SESSION] paste.rs success, length: ${content.length}`);
            return content;
        }
        console.warn('[SESSION] paste.rs returned non‑JSON content');
        return null;
    } catch (error) {
        console.warn(`[SESSION] paste.rs fetch failed: ${error.message}`);
        return null;
    }
}

/**
 * Downloads credentials from Pastebin/paste.rs and saves them to session/creds.json.
 * @param {string} txt - Session identifier (e.g., "Stanytz378/iamlegendv2_abc123")
 */
async function SaveCreds(txt) {
    const pasteId = extractPasteId(txt);
    if (!pasteId) {
        throw new Error('Invalid session ID format. Expected: stany~bots_<pasteId>');
    }

    console.log(`📥 Downloading session (paste ID: ${pasteId})`);

    // Try Pastebin first, then paste.rs
    let data = await fetchFromPastebin(pasteId);
    if (!data) {
        data = await fetchFromPasteRs(pasteId);
    }

    if (!data) {
        throw new Error(
            'Failed to download credentials from both Pastebin and paste.rs.\n' +
            'The paste may have expired or the session ID is invalid.\n' +
            `Paste ID: ${pasteId}`
        );
    }

    // Validate that the content is valid JSON
    try {
        JSON.parse(data);
    } catch (e) {
        throw new Error(`Downloaded session data is not valid JSON: ${data.substring(0, 100)}...`);
    }

    // Ensure session directory exists
    const sessionDir = path.join(process.cwd(), 'session');
    if (!fs.existsSync(sessionDir)) {
        fs.mkdirSync(sessionDir, { recursive: true });
        console.log(`[SESSION] Created session directory: ${sessionDir}`);
    }

    const credsPath = path.join(sessionDir, 'creds.json');
    fs.writeFileSync(credsPath, data);
    console.log('✅ Credentials saved to session/creds.json');
}

export default SaveCreds;
    }

    // Check for format: stany~bots_<pasteId>
    if (txt.startsWith('stany~bots_')) {
        const pasteId = txt.replace('stany~bots_', '');
        return pasteId || null;
    }

    // Check for format: Stanytz378/iamlegendv2_<pasteId>
    if (txt.includes('_')) {
        const parts = txt.split('_');
        const pasteId = parts[parts.length - 1];
        return pasteId || null;
    }

    // If it's just a plain paste ID (no prefix)
    if (txt.length >= 5 && /^[a-zA-Z0-9_-]+$/.test(txt)) {
        return txt;
    }

    return null;
}

/**
 * Attempts to fetch raw content from Pastebin.
 * @param {string} pasteId 
 * @returns {Promise<string|null>}
 */
async function fetchFromPastebin(pasteId) {
    try {
        const url = `https://pastebin.com/raw/${pasteId}`;
        console.log(`[SESSION] Trying Pastebin: ${url}`);
        const response = await axios.get(url, { 
            timeout: 15000,
            validateStatus: (status) => status === 200
        });
        const content = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
        const trimmed = content.trim();
        if (trimmed && (trimmed.startsWith('{') || trimmed.startsWith('['))) {
            console.log(`[SESSION] Pastebin success, length: ${content.length}`);
            return content;
        }
        console.warn('[SESSION] Pastebin returned non‑JSON content');
        return null;
    } catch (error) {
        console.warn(`[SESSION] Pastebin fetch failed: ${error.message}`);
        return null;
    }
}

/**
 * Attempts to fetch raw content from paste.rs.
 * @param {string} pasteId 
 * @returns {Promise<string|null>}
 */
async function fetchFromPasteRs(pasteId) {
    try {
        const url = `https://paste.rs/${pasteId}`;
        console.log(`[SESSION] Trying paste.rs: ${url}`);
        const response = await axios.get(url, { 
            timeout: 15000,
            validateStatus: (status) => status === 200
        });
        const content = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
        const trimmed = content.trim();
        if (trimmed && (trimmed.startsWith('{') || trimmed.startsWith('['))) {
            console.log(`[SESSION] paste.rs success, length: ${content.length}`);
            return content;
        }
        console.warn('[SESSION] paste.rs returned non‑JSON content');
        return null;
    } catch (error) {
        console.warn(`[SESSION] paste.rs fetch failed: ${error.message}`);
        return null;
    }
}

/**
 * Validates that the content is valid JSON and has required Baileys fields.
 * @param {string} content - JSON string
 * @returns {object} Parsed JSON
 * @throws {Error} If invalid
 */
function validateCreds(content) {
    let parsed;
    try {
        parsed = JSON.parse(content);
    } catch (e) {
        throw new Error(`Invalid JSON: ${e.message}`);
    }

    // If wrapped in { creds: ... }, extract it
    if (parsed.creds && typeof parsed.creds === 'object') {
        parsed = parsed.creds;
        console.log('[SESSION] Extracted creds from wrapper');
    }

    // Check required fields
    const required = ['noiseKey', 'signedIdentityKey', 'signedPreKey'];
    const missing = required.filter(field => !parsed[field]);
    if (missing.length > 0) {
        throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    return parsed;
}

/**
 * Downloads credentials from Pastebin/paste.rs and saves them to session/creds.json.
 * @param {string} txt - Session identifier (e.g., "Stanytz378/iamlegendv2_abc123" or "stany~bots_abc123")
 */
async function SaveCreds(txt) {
    const pasteId = extractPasteId(txt);
    if (!pasteId) {
        throw new Error(
            '❌ Invalid session ID format.\n' +
            'Expected formats:\n' +
            '  • Stanytz378/iamlegendv2_<pasteId>\n' +
            '  • stany~bots_<pasteId>\n' +
            `Received: ${txt}`
        );
    }

    console.log(`📥 Downloading session (paste ID: ${pasteId})`);

    // Try Pastebin first, then paste.rs
    let data = await fetchFromPastebin(pasteId);
    if (!data) {
        data = await fetchFromPasteRs(pasteId);
    }

    if (!data) {
        throw new Error(
            `❌ Failed to download credentials from both Pastebin and paste.rs.\n` +
            `Paste ID: ${pasteId}\n` +
            `Possible causes:\n` +
            `  • The paste has expired or been deleted\n` +
            `  • The session ID is incorrect\n` +
            `  • Network connectivity issues`
        );
    }

    // Validate JSON and extract creds if wrapped
    let finalCreds;
    try {
        finalCreds = validateCreds(data);
    } catch (e) {
        throw new Error(`❌ Downloaded session data is invalid: ${e.message}`);
    }

    // Ensure session directory exists
    const sessionDir = path.join(process.cwd(), 'session');
    if (!fs.existsSync(sessionDir)) {
        fs.mkdirSync(sessionDir, { recursive: true });
        console.log(`[SESSION] Created session directory: ${sessionDir}`);
    }

    // Clean any stale app-state-sync-key files
    const files = fs.readdirSync(sessionDir);
    for (const file of files) {
        if (file.startsWith('app-state-sync-key-')) {
            fs.unlinkSync(path.join(sessionDir, file));
            console.log(`[SESSION] Removed stale key file: ${file}`);
        }
    }

    // Write the final creds (without wrapper)
    const credsPath = path.join(sessionDir, 'creds.json');
    fs.writeFileSync(credsPath, JSON.stringify(finalCreds, null, 2));
    console.log('✅ Credentials saved to session/creds.json');

    // Final verification
    try {
        const saved = fs.readFileSync(credsPath, 'utf8');
        const verified = JSON.parse(saved);
        if (!verified.noiseKey) {
            throw new Error('Saved credentials missing noiseKey');
        }
        console.log(`✅ Final verification passed. File size: ${(saved.length / 1024).toFixed(1)} KB`);
    } catch (e) {
        fs.unlinkSync(credsPath);
        throw new Error(`❌ Failed to verify saved credentials: ${e.message}`);
    }
}

export default SaveCreds;
