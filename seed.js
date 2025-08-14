// seed.js

// Este script é usado para popular (semear) a base de dados Firestore com os dados iniciais.
// Deve ser executado apenas uma vez.

// Importa o SDK de Admin do Firebase
const admin = require('firebase-admin');

// Importa a chave da conta de serviço que descarregou
const serviceAccount = require('./serviceAccountKey.json');

// Inicializa a aplicação Firebase com as suas credenciais
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Obtém uma referência à base de dados Firestore
const db = admin.firestore();

// --- OS SEUS DADOS ESTÁTICOS ---
const crimeData = [
    { uf: "AC", nome: "Acre", roubo23: 640, furto23: 696, taxaRoubo23: 183.9, taxaFurto23: 199.9, varRoubo: -10.4, varFurto: 18.9 },
    { uf: "AL", nome: "Alagoas", roubo23: 1914, furto23: 1833, taxaRoubo23: 178.3, taxaFurto23: 170.8, varRoubo: 5.1, varFurto: -16.0 },
    { uf: "AP", nome: "Amapá", roubo23: 300, furto23: 358, taxaRoubo23: 124.1, taxaFurto23: 148.1, varRoubo: -39.7, varFurto: -5.4 },
    { uf: "AM", nome: "Amazonas", roubo23: 1204, furto23: 1608, taxaRoubo23: 107.3, taxaFurto23: 143.3, varRoubo: -19.4, varFurto: -24.5 },
    { uf: "BA", nome: "Bahia", roubo23: 12388, furto23: 6555, taxaRoubo23: 241.8, taxaFurto23: 128.0, varRoubo: -6.1, varFurto: -3.5 },
    { uf: "CE", nome: "Ceará", roubo23: 7794, furto23: 6081, taxaRoubo23: 207.3, taxaFurto23: 161.8, varRoubo: -2.2, varFurto: -0.5 },
    { uf: "DF", nome: "Distrito Federal", roubo23: 1294, furto23: 3293, taxaRoubo23: 62.6, taxaFurto23: 159.3, varRoubo: -19.1, varFurto: -14.3 },
    { uf: "ES", nome: "Espírito Santo", roubo23: 2679, furto23: 4092, taxaRoubo23: 114.8, taxaFurto23: 175.3, varRoubo: -17.5, varFurto: -14.6 },
    { uf: "GO", nome: "Goiás", roubo23: 1031, furto23: 4544, taxaRoubo23: 21.9, taxaFurto23: 96.6, varRoubo: -32.7, varFurto: -21.4 },
    { uf: "MA", nome: "Maranhão", roubo23: 3822, furto23: 2592, taxaRoubo23: 181.1, taxaFurto23: 122.9, varRoubo: -9.0, varFurto: -11.6 },
    { uf: "MT", nome: "Mato Grosso", roubo23: 1077, furto23: 2239, taxaRoubo23: 40.4, taxaFurto23: 84.0, varRoubo: 8.1, varFurto: -7.3 },
    { uf: "MS", nome: "Mato Grosso do Sul", roubo23: 384, furto23: 2867, taxaRoubo23: 20.4, taxaFurto23: 152.4, varRoubo: -20.8, varFurto: -22.9 },
    { uf: "MG", nome: "Minas Gerais", roubo23: 4371, furto23: 23326, taxaRoubo23: 32.5, taxaFurto23: 173.6, varRoubo: -22.9, varFurto: -1.0 },
    { uf: "PA", nome: "Pará", roubo23: 1533, furto23: 2639, taxaRoubo23: 59.5, taxaFurto23: 102.4, varRoubo: -29.1, varFurto: -28.3 },
    { uf: "PB", nome: "Paraíba", roubo23: 3647, furto23: 1793, taxaRoubo23: 231.3, taxaFurto23: 113.7, varRoubo: -18.5, varFurto: 15.0 },
    { uf: "PR", nome: "Paraná", roubo23: 3033, furto23: 12541, taxaRoubo23: 34.4, taxaFurto23: 142.4, varRoubo: -16.1, varFurto: -11.8 },
    { uf: "PE", nome: "Pernambuco", roubo23: 12537, furto23: 7911, taxaRoubo23: 352.2, taxaFurto23: 222.3, varRoubo: 10.5, varFurto: 9.0 },
    { uf: "PI", nome: "Piauí", roubo23: 4227, furto23: 1976, taxaRoubo23: 295.0, taxaFurto23: 137.9, varRoubo: -10.1, varFurto: -18.1 },
    { uf: "RJ", nome: "Rio de Janeiro", roubo23: 22248, furto23: 16577, taxaRoubo23: 291.1, taxaFurto23: 216.8, varRoubo: -14.3, varFurto: -4.6 },
    { uf: "RN", nome: "Rio Grande do Norte", roubo23: 3338, furto23: 2385, taxaRoubo23: 216.8, taxaFurto23: 154.9, varRoubo: -24.4, varFurto: 13.1 },
    { uf: "RS", nome: "Rio Grande do Sul", roubo23: 3591, furto23: 8555, taxaRoubo23: 44.5, taxaFurto23: 106.1, varRoubo: -20.6, varFurto: -6.9 },
    { uf: "RO", nome: "Rondônia", roubo23: 969, furto23: 2320, taxaRoubo23: 80.8, taxaFurto23: 193.4, varRoubo: -33.1, varFurto: -14.0 },
    { uf: "RR", nome: "Roraima", roubo23: 285, furto23: 698, taxaRoubo23: 103.5, taxaFurto23: 253.5, varRoubo: -16.8, varFurto: -0.6 },
    { uf: "SC", nome: "Santa Catarina", roubo23: 1078, furto23: 7292, taxaRoubo23: 17.5, taxaFurto23: 118.3, varRoubo: -18.6, varFurto: -13.4 },
    { uf: "SP", nome: "São Paulo", roubo23: 37471, furto23: 94258, taxaRoubo23: 112.4, taxaFurto23: 282.7, varRoubo: -12.8, varFurto: -5.3 },
    { uf: "SE", nome: "Sergipe", roubo23: 774, furto23: 861, taxaRoubo23: 82.0, taxaFurto23: 91.2, varRoubo: -54.0, varFurto: -9.8 },
    { uf: "TO", nome: "Tocantins", roubo23: 209, furto23: 1014, taxaRoubo23: 24.2, taxaFurto23: 117.5, varRoubo: -52.5, varFurto: -35.8 },
];

const trafficDataAll = [
    { uf: "AC", nome: "Acre", sinistros: 287, feridos: 357, mortos: 20 },
    { uf: "AL", nome: "Alagoas", sinistros: 712, feridos: 803, mortos: 97 },
    { uf: "AM", nome: "Amazonas", sinistros: 169, feridos: 253, mortos: 26 },
    { uf: "AP", nome: "Amapá", sinistros: 159, feridos: 176, mortos: 11 },
    { uf: "BA", nome: "Bahia", sinistros: 4151, feridos: 5352, mortos: 619 },
    { uf: "CE", nome: "Ceará", sinistros: 1500, feridos: 1735, mortos: 185 },
    { uf: "DF", nome: "Distrito Federal", sinistros: 1056, feridos: 1143, mortos: 28 },
    { uf: "ES", nome: "Espírito Santo", sinistros: 2395, feridos: 2989, mortos: 176 },
    { uf: "GO", nome: "Goiás", sinistros: 3305, feridos: 3595, mortos: 297 },
    { uf: "MA", nome: "Maranhão", sinistros: 1138, feridos: 1204, mortos: 280 },
    { uf: "MG", nome: "Minas Gerais", sinistros: 9296, feridos: 11756, mortos: 794 },
    { uf: "MS", nome: "Mato Grosso do Sul", sinistros: 1803, feridos: 1940, mortos: 182 },
    { uf: "MT", nome: "Mato Grosso", sinistros: 2554, feridos: 2717, mortos: 244 },
    { uf: "PA", nome: "Pará", sinistros: 970, feridos: 1039, mortos: 216 },
    { uf: "PB", nome: "Paraíba", sinistros: 1920, feridos: 2201, mortos: 134 },
    { uf: "PE", nome: "Pernambuco", sinistros: 3230, feridos: 3581, mortos: 312 },
    { uf: "PI", nome: "Piauí", sinistros: 1520, feridos: 1662, mortos: 171 },
    { uf: "PR", nome: "Paraná", sinistros: 7576, feridos: 8456, mortos: 607 },
    { uf: "RJ", nome: "Rio de Janeiro", sinistros: 6389, feridos: 7548, mortos: 333 },
    { uf: "RN", nome: "Rio Grande do Norte", sinistros: 1606, feridos: 1906, mortos: 118 },
    { uf: "RO", nome: "Rondônia", sinistros: 1483, feridos: 1736, mortos: 111 },
    { uf: "RR", nome: "Roraima", sinistros: 135, feridos: 247, mortos: 29 },
    { uf: "RS", nome: "Rio Grande do Sul", sinistros: 5206, feridos: 5730, mortos: 346 },
    { uf: "SC", nome: "Santa Catarina", sinistros: 8381, feridos: 9535, mortos: 415 },
    { uf: "SE", nome: "Sergipe", sinistros: 597, feridos: 675, mortos: 59 },
    { uf: "SP", nome: "São Paulo", sinistros: 4883, feridos: 5333, mortos: 226 },
    { uf: "TO", nome: "Tocantins", sinistros: 735, feridos: 857, mortos: 124 },
];

const trafficMotorcycleData = [
    { uf: "AC", nome: "Acre", feridos: 222, mortos: 8 },
    { uf: "AL", nome: "Alagoas", feridos: 344, mortos: 43 },
    { uf: "AM", nome: "Amazonas", feridos: 55, mortos: 13 },
    { uf: "AP", nome: "Amapá", feridos: 80, mortos: 2 },
    { uf: "BA", nome: "Bahia", feridos: 2044, mortos: 189 },
    { uf: "CE", nome: "Ceará", feridos: 1004, mortos: 91 },
    { uf: "DF", nome: "Distrito Federal", feridos: 556, mortos: 8 },
    { uf: "ES", nome: "Espírito Santo", feridos: 1533, mortos: 60 },
    { uf: "GO", nome: "Goiás", feridos: 1152, mortos: 64 },
    { uf: "MA", nome: "Maranhão", feridos: 501, mortos: 137 },
    { uf: "MG", nome: "Minas Gerais", feridos: 3473, mortos: 171 },
    { uf: "MS", nome: "Mato Grosso do Sul", feridos: 709, mortos: 41 },
    { uf: "MT", nome: "Mato Grosso", feridos: 878, mortos: 74 },
    { uf: "PA", nome: "Pará", feridos: 452, mortos: 124 },
    { uf: "PB", nome: "Paraíba", feridos: 1369, mortos: 72 },
    { uf: "PE", nome: "Pernambuco", feridos: 2062, mortos: 159 },
    { uf: "PI", nome: "Piauí", feridos: 961, mortos: 97 },
    { uf: "PR", nome: "Paraná", feridos: 2819, mortos: 119 },
    { uf: "RJ", nome: "Rio de Janeiro", feridos: 3699, mortos: 130 },
    { uf: "RN", nome: "Rio Grande do Norte", feridos: 1183, mortos: 56 },
    { uf: "RO", nome: "Rondônia", feridos: 984, mortos: 54 },
    { uf: "RR", nome: "Roraima", feridos: 65, mortos: 16 },
    { uf: "RS", nome: "Rio Grande do Sul", feridos: 1849, mortos: 54 },
    { uf: "SC", nome: "Santa Catarina", feridos: 4379, mortos: 108 },
    { uf: "SE", nome: "Sergipe", feridos: 347, mortos: 26 },
    { uf: "SP", nome: "São Paulo", feridos: 2585, mortos: 57 },
    { uf: "TO", nome: "Tocantins", feridos: 321, mortos: 51 },
];

const ivrDataByBrand = {
    "Chevrolet": {
        "Onix": { ivr: "1.79%", analysis: "Como líder de vendas por anos, sua onipresença nas ruas o torna um alvo constante. O alto custo de peças de reposição originais, como faróis de LED e centrais multimídia, alimenta um mercado paralelo robusto, tornando o furto para desmanche extremamente lucrativo." },
        "Onix Plus": { ivr: "1.55%", analysis: "Compartilhando a mesma plataforma e peças do hatch, o sedan é igualmente visado. É um dos carros preferidos por motoristas de aplicativo, aumentando sua exposição e o tornando um alvo frequente para roubos de oportunidade e furtos para suprir a demanda por peças de manutenção." },
        "Tracker": { ivr: "1.29%", analysis: "SUV que ganhou muita popularidade, tornando-se um alvo crescente para roubo e clonagem devido ao seu alto valor de revenda e grande frota circulante." }
    },
    "Fiat": {
        "Argo": { ivr: "1.71%", analysis: "Sua popularidade, especialmente em frotas de locadoras, aumenta o número de unidades circulando e o torna um alvo comum. O design moderno e as peças de acabamento são muito procurados no mercado ilegal para reparos de colisões." },
        "Cronos": { ivr: "1.68%", analysis: "Assim como o Argo, sua presença em frotas de aluguel e de motoristas de aplicativo o expõe ao risco. O porta-malas espaçoso também o torna um alvo para criminosos que buscam um veículo para transporte em atividades ilícitas." },
        "Fiorino": { ivr: "3.20%", analysis: "É o veículo de trabalho por excelência para pequenas e médias empresas. É visado não apenas pelo veículo em si, mas frequentemente pelas cargas que transporta. Sua concepção mais simples e a falta de itens de segurança sofisticados facilitam a ação dos criminosos." },
        "Mobi": { ivr: "1.58%", analysis: "Veículo de entrada muito utilizado em frotas de empresas e locadoras, o que aumenta sua exposição. É visado principalmente para o desmanche e venda de peças de baixo custo." },
        "Pulse": { ivr: "1.45%", analysis: "Como um dos SUVs mais recentes e de sucesso da marca, atrai a atenção de quadrilhas para clonagem e desmanche de peças de tecnologia e acabamento." },
        "Strada": { ivr: "1.40%", analysis: "Líder absoluta no segmento de picapes leves, é um veículo de dupla finalidade (trabalho e lazer). É extremamente visada em áreas rurais para atividades agrícolas e também para a prática de crimes, como o transporte de mercadorias roubadas, devido à sua robustez." },
        "Toro": { ivr: "1.52%", analysis: "Com alto valor agregado e design cobiçado, é um alvo para quadrilhas especializadas em clonagem para revenda em mercados ilegais, inclusive em países vizinhos. Suas peças, como a capota marítima e rodas, também são muito procuradas." }
    },
     "Ford": {
        "Ka": { ivr: "1.82%", analysis: "Modelo extremamente popular que saiu de linha, o que aumenta drasticamente a procura por suas peças de reposição no mercado paralelo, elevando o risco de furto para desmanche." },
        "Ranger": { ivr: "1.20%", analysis: "Picape média robusta, visada em áreas rurais para atividades ilícitas e também para desmanche de peças de alto valor, como motor e tração 4x4." }
    },
    "Hyundai": {
        "HB20": { ivr: "1.98%", analysis: "Um dos carros mais vendidos do Brasil, sua popularidade gera uma demanda constante por peças no mercado paralelo. O custo elevado de componentes de lataria e faróis na rede autorizada faz com que proprietários busquem alternativas mais baratas, aquecendo o mercado de desmanche." },
        "HB20S": { ivr: "1.88%", analysis: "A versão sedan do HB20 compartilha do mesmo alto risco, sendo um alvo preferencial para criminosos que buscam veículos com porta-malas maior para uso em outros delitos ou para desmanche." },
        "Creta": { ivr: "1.35%", analysis: "Como um dos SUVs mais populares, seu alto valor de revenda o torna um alvo atrativo para roubo e clonagem. Além disso, peças como a central multimídia, rodas de liga leve e estepe são alvos frequentes de furto." }
    },
    "Jeep": {
        "Compass": { ivr: "1.28%", analysis: "Sendo um SUV de médio porte com status de luxo, é visado por quadrilhas especializadas que focam em veículos de alto padrão. O roubo é frequentemente destinado à clonagem e revenda em outros estados ou países, ou para o desmanche de peças de alto valor." },
        "Renegade": { ivr: "1.33%", analysis: "Sua enorme popularidade o torna um alvo visível. O estepe localizado externamente em algumas versões antigas era um alvo notório, e hoje, peças como faróis de LED e kit multimídia são muito cobiçadas no mercado ilegal." }
    },
    "Nissan": {
        "Kicks": { ivr: "1.22%", analysis: "SUV compacto com forte presença no mercado, visado tanto pelo seu valor de revenda no mercado ilegal quanto pela demanda por peças de reposição, como faróis e lanternas em LED." }
    },
    "Renault": {
        "Kwid": { ivr: "1.65%", analysis: "Como um dos carros mais baratos do Brasil, sua frota é imensa. O alto índice de furto é explicado pela grande procura por peças de baixo custo para reparos de pequenas colisões, comuns em centros urbanos." }
    },
    "Toyota": {
        "Corolla": { ivr: "0.98%", analysis: "Apesar de ser um dos sedans mais vendidos, seu risco é moderado. Isso se deve à forte rede de distribuição de peças da Toyota, que reduz a demanda no mercado paralelo, e a um perfil de comprador geralmente mais cuidadoso e que investe em seguros e segurança." },
        "Corolla Cross": { ivr: "1.05%", analysis: "Versão SUV do Corolla, compartilha da boa reputação de segurança, mas sua crescente popularidade e maior valor agregado o tornam um alvo um pouco mais visado que o sedan." },
        "Hilux": { ivr: "1.15%", analysis: "É a picape preferida para atividades ilícitas em áreas rurais e de fronteira devido à sua robustez e capacidade off-road. Muitas são roubadas e levadas para países vizinhos, onde são trocadas por drogas ou armas, ou utilizadas por quadrilhas em regiões de difícil acesso." },
        "Yaris": { ivr: "0.95%", analysis: "Assim como o Corolla, se beneficia da forte imagem de confiabilidade da marca e de uma rede de peças que diminui o apelo do mercado ilegal, resultando em um risco moderado." }
    },
    "Volkswagen": {
        "Gol": { ivr: "1.85%", analysis: "Por décadas foi o carro mais vendido do Brasil, o que resultou em uma frota gigantesca. A imensa intercambialidade de suas peças entre diferentes anos e modelos cria um mercado de desmanche vasto e sempre ativo." },
        "Nivus": { ivr: "1.25%", analysis: "Seu design de SUV cupê e a percepção de novidade o tornam um alvo para roubos de oportunidade e para quadrilhas que buscam modelos recentes para clonagem. Peças de tecnologia embarcada, como a central VW Play, são particularmente visadas." },
        "Polo": { ivr: "1.60%", analysis: "Com uma base mecânica compartilhada com outros modelos da marca (Virtus, Nivus, T-Cross), suas peças são muito procuradas. É um carro popular entre o público jovem, o que aumenta sua exposição em horários e locais de maior risco." },
        "T-Cross": { ivr: "1.30%", analysis: "Líder de vendas no segmento de SUVs compactos, sua popularidade o torna um alvo natural. Assim como outros SUVs, é visado para desmanche de peças de alto valor e para clonagem, devido ao seu bom valor de revenda no mercado ilegal." },
        "Voyage": { ivr: "2.15%", analysis: "Compartilhando a plataforma e muitas peças com o Gol, sofre do mesmo problema crônico: uma demanda altíssima por componentes no mercado de desmanche. Sua fama de carro robusto e confiável também o torna um alvo para motoristas de aplicativo." }
    },
    "Honda (Motos)": {
        "CG 160": { ivr: "4.50%", analysis: "É a rainha absoluta do mercado ilegal de peças. Sendo a moto mais vendida do Brasil por décadas, praticamente qualquer componente dela tem demanda imediata. É o principal alvo para desmanche, alimentando um ciclo contínuo de furtos e roubos." },
        "Biz": { ivr: "3.80%", analysis: "Extremamente popular para deslocamentos curtos e como ferramenta de trabalho (delivery), sua facilidade de pilotagem e leveza a tornam um alvo muito fácil para ladrões. É frequentemente furtada quando estacionada na rua." },
        "XRE 300": { ivr: "2.80%", analysis: "Com maior valor agregado, é um alvo cobiçado em roubos à mão armada. É visada para a venda de peças mais caras (motor, suspensão) e também para ser usada por criminosos em fugas, devido ao seu bom desempenho e versatilidade." }
    },
     "Yamaha (Motos)": {
        "Fazer 250": { ivr: "3.50%", analysis: "Como principal concorrente da Honda no segmento, é um alvo frequente para desmanche. Suas peças, especialmente motor, rodas e painel, têm alta procura no mercado paralelo para manutenção de outras motos do mesmo modelo." },
        "Lander 250": { ivr: "2.90%", analysis: "Seu perfil de uso misto (on/off-road) e sua robustez a tornam valiosa para criminosos que atuam em áreas rurais ou de difícil acesso. É visada tanto para desmanche quanto para ser usada como veículo de fuga." }
    }
};


// Função para enviar dados para uma coleção
async function seedCollection(collectionName, data) {
  const collectionRef = db.collection(collectionName);
  console.log(`A semear a coleção: ${collectionName}...`);
  
  if (Array.isArray(data)) {
    const batch = db.batch();
    data.forEach(item => {
      const docRef = collectionRef.doc(item.uf || item.nome); 
      batch.set(docRef, item);
    });
    await batch.commit();
  } else {
    for (const brand in data) {
      const docRef = collectionRef.doc(brand);
      await docRef.set({ models: data[brand] });
    }
  }

  console.log(`Coleção ${collectionName} semeada com sucesso!`);
}

// Função principal para executar tudo
async function main() {
  try {
    await seedCollection('security', crimeData);
    await seedCollection('traffic_all', trafficDataAll);
    await seedCollection('traffic_motorcycle', trafficMotorcycleData);
    await seedCollection('ivr_data', ivrDataByBrand);
    console.log('\nTodos os dados foram enviados para o Firestore com sucesso!');
  } catch (error) {
    console.error('Ocorreu um erro ao semear a base de dados:', error);
  }
}

// Executa a função principal
main();
