// server.js

// --- Dependências ---
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// --- Configuração do Firebase ---

// Tenta obter as credenciais da variável de ambiente (para a Vercel)
// Se não encontrar, usa o ficheiro local (para desenvolvimento)
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : require('./serviceAccountKey.json');

// --- Inicialização do App Express ---
const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- Rotas da API (a ler do Firestore) ---

// Rota principal
app.get('/', (req, res) => {
  res.send('Servidor do Painel de Segurança está no ar e conectado ao Firestore!');
});

// Função auxiliar para buscar uma coleção inteira
const fetchCollection = async (collectionName) => {
    const snapshot = await db.collection(collectionName).get();
    const data = [];
    snapshot.forEach(doc => {
        data.push(doc.data());
    });
    return data;
};

// Endpoint de dados de segurança
app.get('/api/security', async (req, res) => {
  try {
    const securityData = await fetchCollection('security');
    res.json(securityData);
  } catch (error) {
    console.error("Erro ao buscar dados de segurança:", error);
    res.status(500).send("Erro interno do servidor");
  }
});

// Endpoint de dados de trânsito (todos)
app.get('/api/traffic/all', async (req, res) => {
  try {
    const trafficAllData = await fetchCollection('traffic_all');
    res.json(trafficAllData);
  } catch (error) {
    console.error("Erro ao buscar dados de trânsito (todos):", error);
    res.status(500).send("Erro interno do servidor");
  }
});

// Endpoint de dados de trânsito (motos)
app.get('/api/traffic/motorcycle', async (req, res) => {
  try {
    const trafficMotorcycleData = await fetchCollection('traffic_motorcycle');
    res.json(trafficMotorcycleData);
  } catch (error) {
    console.error("Erro ao buscar dados de trânsito (motos):", error);
    res.status(500).send("Erro interno do servidor");
  }
});

// Endpoint de dados de IVR
app.get('/api/ivr', async (req, res) => {
  try {
    const snapshot = await db.collection('ivr_data').get();
    const ivrData = {};
    snapshot.forEach(doc => {
        ivrData[doc.id] = doc.data().models;
    });
    res.json(ivrData);
  } catch (error) {
    console.error("Erro ao buscar dados de IVR:", error);
    res.status(500).send("Erro interno do servidor");
  }
});


// NOVO ENDPOINT DE RANKING
app.get('/api/rankings', async (req, res) => {
    const { metric, type, collection } = req.query; // Ex: metric=roubo23, type=absolute, collection=security

    if (!metric || !type || !collection) {
        return res.status(400).json({ error: 'Parâmetros metric, type e collection são obrigatórios.' });
    }

    try {
        const data = await fetchCollection(collection);
        
        let calculatedData;

        if (metric === 'total') {
            // Lógica especial para a métrica combinada 'total'
            calculatedData = data.map(item => {
                const value = type === 'rate' ? (item.taxaRoubo23 || 0) + (item.taxaFurto23 || 0) : (item.roubo23 || 0) + (item.furto23 || 0);
                return { ...item, value };
            });
        } else {
            calculatedData = data.map(item => ({
                ...item,
                value: item[metric] || 0
            }));
        }

        const sortedData = calculatedData.sort((a, b) => b.value - a.value);

        const top5 = sortedData.slice(0, 5);
        const bottom5 = sortedData.slice(-5).reverse(); // .reverse() para mostrar do melhor para o pior

        res.json({ top5, bottom5 });

    } catch (error) {
        console.error(`Erro ao gerar ranking para ${metric}:`, error);
        res.status(500).send("Erro interno do servidor ao gerar ranking.");
    }
});


// --- Inicialização do Servidor ---
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
