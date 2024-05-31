export async function Cifrado(estado) {
    const encoder = new TextEncoder();
    const data = encoder.encode(estado);
    
    // Genera una clave de cifrado aleatoria
    const key = await window.crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256,
        },
        true,
        ["encrypt", "decrypt"]
    );
    
    // Genera un vector de inicialización (IV)
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    // Cifra los datos
    const encryptedData = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        key,
        data
    );

    // Exporta la clave en formato JSON Web Key
    const exportedKey = await window.crypto.subtle.exportKey('jwk', key);

    return {
        iv: Array.from(iv),
        encryptedData: Array.from(new Uint8Array(encryptedData)),
        key: exportedKey    
    };
}

// Ejemplo de uso:
Cifrado('Mi mensaje secreto').then(result => {
    console.log('Resultado del cifrado:', result);
});


