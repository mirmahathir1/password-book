import entries from "./store/modules/entries";

const CryptoJS = require('crypto-js');
export const encryptWithAES = (text,passphrase) => {
    let encryptedText = CryptoJS.AES.encrypt(text, passphrase).toString();
    return encryptedText!==""?encryptedText:null;
};

export const decryptWithAES = (ciphertext,passphrase) => {
    const bytes = CryptoJS.AES.decrypt(String(ciphertext), passphrase);
    let decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedText!==""?decryptedText:null;
};

export const encryptOneEntry = (entry,passphrase)=>{
    let encryptedEntry = {...entry};
    Object.keys(encryptedEntry).forEach(function(key) {
        encryptedEntry[key] = encryptWithAES(encryptedEntry[key],passphrase);
    });
    return encryptedEntry
};

export const encryptMultipleEntries = (entries,passphrase)=>{
    let encryptedEntries = {...entries}
    Object.keys(encryptedEntries).forEach(function(key) {
        encryptedEntries[key] = encryptOneEntry(encryptedEntries[key],passphrase);
    });
    return encryptedEntries;
}

export const decryptOneEntry = (entry,passphrase)=>{
    let decryptedEntry = {...entry};
    Object.keys(decryptedEntry).forEach(function(key) {
        decryptedEntry[key] = decryptWithAES(decryptedEntry[key],passphrase);
    });
    return decryptedEntry
};

export const decryptMultipleEntries = (entries,passphrase)=>{
    let decryptedEntries = {...entries}
    Object.keys(decryptedEntries).forEach(function(key) {
        decryptedEntries[key] = decryptOneEntry(decryptedEntries[key],passphrase);
    });
    return decryptedEntries;
}
