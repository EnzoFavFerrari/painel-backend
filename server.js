// server.js

// --- Dependências ---
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// --- Configuração do Firebase ---
let serviceAccount;

// Verifica se a variável de ambiente Base64 existe (para a Vercel)
if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
  console.log("Variável Base64 encontrada. A descodificar...");
  // Descodifica a string Base64 para obter o JSON original
  const decodedServiceAccount = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf-8');
  serviceAccount = JSON.parse(decodedServiceAccount);
  console.log("Chave descodificada com sucesso. ID do Projeto:", serviceAccount.project_id);
} else {
  // Se não, usa o ficheiro local (para desenvolvimento)
  console.log("A usar o ficheiro local serviceAccountKey.json.");
  serviceAccount = require('./serviceAccountKey.json');
}

// Inicializa a aplicação Firebase com as credenciais corretas
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// --- Inicialização do App Express ---
const app = express();

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- Rotas da API ---

// Rota principal
app.get('/', (req, res) => {
  res.send('Servidor do Painel de Segurança está no ar e conectado ao Firestore!');
});

// Função auxiliar para buscar uma coleção
const fetchCollection = async (collectionName) => {
    const snapshot = await db.collection(collectionName).get();
    const data = snapshot.docs.map(doc => doc.data());
    return data;
};

// Endpoint de Segurança
app.get('/api/security', async (req, res) => {
  try {
    const securityData = await fetchCollection('security');
    res.json(securityData);
  } catch (error) {
    console.error("Erro ao buscar dados de segurança:", error.message);
    res.status(500).send("Erro interno do servidor ao buscar dados de segurança.");
  }
});

// Endpoint de Trânsito (Todos)
app.get('/api/traffic/all', async (req, res) => {
    try {
        const data = await fetchCollection('traffic_all');
        res.json(data);
    } catch (e) {
        console.error("Erro ao buscar dados de trânsito (todos):", e.message);
        res.status(500).send("Erro interno do servidor.");
    }
});

// Endpoint de Trânsito (Motos)
app.get('/api/traffic/motorcycle', async (req, res) => {
    try {
        const data = await fetchCollection('traffic_motorcycle');
        res.json(data);
    } catch (e) {
        console.error("Erro ao buscar dados de trânsito (motos):", e.message);
        res.status(500).send("Erro interno do servidor.");
    }
});

// Endpoint de IVR
app.get('/api/ivr', async (req, res) => {
    try {
        const snapshot = await db.collection('ivr_data').get();
        const ivrData = {};
        snapshot.forEach(doc => {
            ivrData[doc.id] = doc.data().models;
        });
        res.json(ivrData);
    } catch (e) {
        console.error("Erro ao buscar dados de IVR:", e.message);
        res.status(500).send("Erro interno do servidor.");
    }
});

// Endpoint de Rankings
app.get('/api/rankings', async (req, res) => {
    const { metric, type, collection } = req.query;
    if (!metric || !type || !collection) {
        return res.status(400).json({ error: 'Parâmetros obrigatórios em falta.' });
    }
    try {
        const data = await fetchCollection(collection);
        let calculatedData;
        if (metric === 'total') {
            calculatedData = data.map(item => ({ ...item, value: (type === 'rate' ? (item.taxaRoubo23 || 0) + (item.taxaFurto23 || 0) : (item.roubo23 || 0) + (item.furto23 || 0)) }));
        } else {
            calculatedData = data.map(item => ({ ...item, value: item[metric] || 0 }));
        }
        const sortedData = calculatedData.sort((a, b) => b.value - a.value);
        res.json({ top5: sortedData.slice(0, 5), bottom5: sortedData.slice(-5).reverse() });
    } catch (e) {
        console.error("Erro ao gerar rankings:", e.message);
        res.status(500).send("Erro interno do servidor.");
    }
});

// Exporta a app para a Vercel
module.exports = app;
