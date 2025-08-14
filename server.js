// server.js

const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// --- Configuração do Firebase ---
// Lê as credenciais diretamente da variável de ambiente da Vercel.
// O nome 'GOOGLE_CREDENTIALS' é frequentemente usado e bem suportado.
const serviceAccount = JSON.parse(process.env.GOOGLE_CREDENTIALS);

// Inicializa a aplicação Firebase
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();
const app = express();

app.use(cors());
app.use(express.json());

// --- Rotas da API ---
app.get('/', (req, res) => {
  res.send('Servidor do Painel de Segurança está no ar!');
});

const fetchCollection = async (collectionName) => {
    const snapshot = await db.collection(collectionName).get();
    return snapshot.docs.map(doc => doc.data());
};

app.get('/api/security', async (req, res) => {
  try {
    const data = await fetchCollection('security');
    res.json(data);
  } catch (error) {
    console.error("Erro Final em /api/security:", error.message);
    res.status(500).send("Erro interno do servidor.");
  }
});

// O resto das suas rotas
app.get('/api/traffic/all', async (req, res) => { try { res.json(await fetchCollection('traffic_all')); } catch (e) { res.status(500).send("Erro") } });
app.get('/api/traffic/motorcycle', async (req, res) => { try { res.json(await fetchCollection('traffic_motorcycle')); } catch (e) { res.status(500).send("Erro") } });
app.get('/api/ivr', async (req, res) => { try { const snapshot = await db.collection('ivr_data').get(); const ivrData = {}; snapshot.forEach(doc => { ivrData[doc.id] = doc.data().models; }); res.json(ivrData); } catch (e) { res.status(500).send("Erro") } });
app.get('/api/rankings', async (req, res) => { const { metric, type, collection } = req.query; if (!metric || !type || !collection) { return res.status(400).json({ error: 'Parâmetros obrigatórios em falta.' }); } try { const data = await fetchCollection(collection); let calculatedData; if (metric === 'total') { calculatedData = data.map(item => ({ ...item, value: (type === 'rate' ? (item.taxaRoubo23 || 0) + (item.taxaFurto23 || 0) : (item.roubo23 || 0) + (item.furto23 || 0)) })); } else { calculatedData = data.map(item => ({ ...item, value: item[metric] || 0 })); } const sortedData = calculatedData.sort((a, b) => b.value - a.value); res.json({ top5: sortedData.slice(0, 5), bottom5: sortedData.slice(-5).reverse() }); } catch (e) { res.status(500).send("Erro") } });


module.exports = app;
