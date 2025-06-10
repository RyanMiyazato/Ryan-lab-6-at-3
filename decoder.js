const axios = require('axios');
const { Buffer } = require('buffer');

async function decodeIoTData() {
    try {
        const url = "https://callback-iot.onrender.com/data";
        const response = await axios.get(url);
        
        // Verifica se a resposta é um array
        if (!Array.isArray(response.data)) {
            console.log("A resposta não é um array como esperado.");
            return;
        }
        
        // Filtra apenas os objetos que contêm hexData
        const hexEntries = response.data.filter(entry => entry.hexData);
        
        if (hexEntries.length === 0) {
            console.log("Nenhum objeto com hexData encontrado no array.");
            return;
        }
        
        // Processa cada entrada com hexData
        hexEntries.forEach((entry, index) => {
            console.log(`\nProcessando entrada ${index + 1}:`);
            console.log(`Dispositivo: ${entry.device}`);
            console.log(`Timestamp: ${entry.timestamp}`);
            
            const hexData = entry.hexData;
            const bufferData = Buffer.from(hexData, 'hex');
            
            if (bufferData.length !== 12) {
                console.log(`Tamanho de dados incorreto. Esperado 12 bytes, obtido ${bufferData.length} bytes.`);
                return;
            }
            
            // Decodifica os valores
            const temperatura = bufferData.readFloatLE(0);
            const umidade = bufferData.readFloatLE(4);
            const pressao = bufferData.readFloatLE(8);
            
            console.log("Resultados decodificados:");
            console.log(`Temperatura: ${temperatura.toFixed(1)} °C`);
            console.log(`Umidade: ${umidade.toFixed(1)} %`);
            console.log(`Pressão: ${pressao.toFixed(1)} hPa`);
            
            // Compara com os valores diretos se existirem
            if (entry.temperature) {
                console.log(`Temperatura direta: ${entry.temperature} °C`);
            }
            if (entry.humidity) {
                console.log(`Umidade direta: ${entry.humidity} %`);
            }
            if (entry.pressure) {
                console.log(`Pressão direta: ${entry.pressure} hPa`);
            }
        });
        
    } catch (error) {
        console.error("Erro durante o processamento:", error.message);
    }
}

decodeIoTData();