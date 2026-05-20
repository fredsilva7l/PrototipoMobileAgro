// data.jsx — fictitious but coherent dataset for the prototype

const FAZENDAS = [
  { id: 'MV',   nome: 'Mata Verde',     cidade: 'Sorriso, MT',     hectares: 4280, op: 32 },
  { id: 'MB',   nome: 'Mata Boa',       cidade: 'Sorriso, MT',     hectares: 3120, op: 24 },
  { id: 'JPJ',  nome: 'João Pedro Jr.', cidade: 'Lucas do RV, MT', hectares: 1840, op: 14 },
  { id: 'CACH', nome: 'Cachoeira',     cidade: 'Sinop, MT',        hectares: 5640, op: 41 },
  { id: 'ESTR', nome: 'Estrada Real',   cidade: 'Sinop, MT',       hectares: 2780, op: 22 },
];

const TALHOES_RANGES = { CACH: [1, 55], ESTR: [1, 27], JPJ: [1, 14], MV: [1, 38], MB: [1, 30] };

const MAQUINAS = [
  { id: 'TR-01', nome: 'Trator John Deere 6135J', tipo: 'Trator',     hor: 4823.7, status: 'op',    fazenda: 'MV',  oleo_em: 187 },
  { id: 'TR-04', nome: 'Trator Valtra BH 180',    tipo: 'Trator',     hor: 6210.0, status: 'op',    fazenda: 'MV',  oleo_em: 22 },
  { id: 'TR-07', nome: 'Trator Massey 7415',      tipo: 'Trator',     hor: 3987.5, status: 'manut', fazenda: 'MV',  oleo_em: -8 },
  { id: 'PV-03', nome: 'Pulverizador Jacto Uniport', tipo: 'Pulver.', hor: 2104.2, status: 'op',    fazenda: 'MV',  oleo_em: 96 },
  { id: 'PV-05', nome: 'Pulverizador Stara Imperador', tipo: 'Pulver.', hor: 1823.0, status: 'op',  fazenda: 'MV',  oleo_em: 230 },
  { id: 'IM-05', nome: 'Implemento Grade Aradora 22D', tipo: 'Implem.', hor: 0,    status: 'op',    fazenda: 'MV',  oleo_em: null },
  { id: 'IM-12', nome: 'Implemento Subsolador 7H',  tipo: 'Implem.',   hor: 0,    status: 'op',     fazenda: 'MV',  oleo_em: null },
];

const SERVICOS = [
  { id: 'PULV',  nome: 'Pulverização',  ico: 'Drop' },
  { id: 'PLAN',  nome: 'Plantio',        ico: 'Wheat' },
  { id: 'SUBS',  nome: 'Subsolagem',     ico: 'Tractor' },
  { id: 'CALA',  nome: 'Calagem',        ico: 'Sheaf' },
  { id: 'GRAD',  nome: 'Gradagem',       ico: 'Tractor' },
  { id: 'COLH',  nome: 'Colheita',       ico: 'Wheat' },
];

const OPERADORES = [
  { id: 'op1', nome: 'Aderbal de Souza',  cpf: '***.***.***-12', funcao: 'Tratorista' },
  { id: 'op2', nome: 'Cleiton Rodrigues', cpf: '***.***.***-45', funcao: 'Tratorista' },
  { id: 'op3', nome: 'Dilermando Pires',  cpf: '***.***.***-78', funcao: 'Pulverizador' },
];

// Pre-existing OS for the operator. Status ciclo:
// rascunho, emitida, aprovada, execucao, pausada, concluida, contestada, cancelada
const OS_LIST = [
  {
    id: 'OS-3127', maquina: 'TR-04', maquinaNome: 'Trator Valtra BH 180', implemento: 'IM-05',
    servico: 'Subsolagem', talhao: 'MV-12', operador: 'Aderbal de Souza',
    data: '10/05/2026', status: 'execucao', hrIni: 6204.5, hrAtu: 6210.0, hrsDia: 5.5, hrsNot: 0,
    fazenda: 'MV', obs: 'Solo úmido na ponta sul.',
  },
  {
    id: 'OS-3120', maquina: 'PV-03', maquinaNome: 'Pulverizador Jacto Uniport', implemento: '—',
    servico: 'Pulverização', talhao: 'MV-08', operador: 'Aderbal de Souza',
    data: '09/05/2026', status: 'aprovada', hrIni: 2098.8, hrAtu: 2104.2, hrsDia: 5.4, hrsNot: 0,
    fazenda: 'MV', obs: '',
  },
  {
    id: 'OS-3115', maquina: 'TR-01', maquinaNome: 'Trator John Deere 6135J', implemento: 'IM-12',
    servico: 'Gradagem', talhao: 'MV-04', operador: 'Aderbal de Souza',
    data: '08/05/2026', status: 'concluida', hrIni: 4810.0, hrAtu: 4823.7, hrsDia: 8.7, hrsNot: 5.0,
    fazenda: 'MV', obs: '',
  },
  {
    id: 'OS-3109', maquina: 'TR-04', maquinaNome: 'Trator Valtra BH 180', implemento: 'IM-05',
    servico: 'Subsolagem', talhao: 'MV-22', operador: 'Aderbal de Souza',
    data: '07/05/2026', status: 'contestada', hrIni: 6190.0, hrAtu: 6204.5, hrsDia: 9.0, hrsNot: 5.5,
    fazenda: 'MV', obs: 'Gerente solicitou ajuste de horas.',
  },
  {
    id: 'OS-3098', maquina: 'PV-05', maquinaNome: 'Pulverizador Stara Imperador', implemento: '—',
    servico: 'Pulverização', talhao: 'MV-15', operador: 'Aderbal de Souza',
    data: '06/05/2026', status: 'cancelada', hrIni: null, hrAtu: null, hrsDia: 0, hrsNot: 0,
    fazenda: 'MV', obs: 'Dia parado por chuva (>30mm).',
  },
];

const ABASTEC_LIST = [
  { id: 'AB-8841', maquina: 'TR-04', litros: 142.0, hor: 6204.5, bomba: 'AGM-01', origem: 'AGM', data: '10/05 07:14', divergencia: 0 },
  { id: 'AB-8839', maquina: 'PV-03', litros: 86.0,  hor: 2098.8, bomba: 'AGM-01', origem: 'AGM', data: '09/05 06:50', divergencia: 0 },
  { id: 'AB-8836', maquina: 'TR-01', litros: 215.0, hor: 4810.0, bomba: 'AGM-02', origem: 'AGM', data: '08/05 06:35', divergencia: 7.5 },
  { id: 'AB-8830', maquina: 'TR-04', litros: 130.0, hor: 6190.0, bomba: 'AGRIUM',  origem: 'Agrium', data: '07/05 14:20', divergencia: 0 },
];

const STATUS_OS = {
  rascunho:   { label: 'Rascunho',     cls: 'warning' },
  emitida:    { label: 'Emitida',      cls: 'info' },
  aprovada:   { label: 'Aprovada',     cls: 'success' },
  execucao:   { label: 'Em execução',  cls: 'olive' },
  pausada:    { label: 'Pausada',      cls: 'warning' },
  concluida:  { label: 'Concluída',    cls: 'success' },
  contestada: { label: 'Contestada',   cls: 'danger' },
  cancelada:  { label: 'Cancelada',    cls: 'neutral' },
};

const STATUS_MAQ = {
  op:    { label: 'Em operação',    cls: 'success' },
  manut: { label: 'Em manutenção',  cls: 'danger' },
  parad: { label: 'Parada',         cls: 'neutral' },
  liber: { label: 'Liberada',       cls: 'info' },
};

const SYNC_QUEUE_INITIAL = [
  { id: 'q1', kind: 'OS',         label: 'Encerramento OS-3127',   sub: 'TR-04 · Subsolagem · MV-12',  ts: '10/05 13:42', size: '4.2 KB' },
  { id: 'q2', kind: 'Abastec.',   label: 'Abastecimento AB-8842',  sub: 'TR-04 · 142 L · AGM-01',      ts: '10/05 13:45', size: '1.1 KB' },
  { id: 'q3', kind: 'Foto NF',    label: 'Anexo NF #41229',         sub: 'OS Externa OE-201 · 1.4 MB',  ts: '10/05 13:46', size: '1.4 MB' },
  { id: 'q4', kind: 'OS',         label: 'Início OS-3128',          sub: 'TR-01 · Plantio · MV-04',     ts: '10/05 13:50', size: '3.8 KB' },
];

window.AGM_DATA = {
  FAZENDAS, MAQUINAS, SERVICOS, OPERADORES, OS_LIST, ABASTEC_LIST,
  TALHOES_RANGES, STATUS_OS, STATUS_MAQ, SYNC_QUEUE_INITIAL,
};
