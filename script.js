const ctx = document.getElementById('graficoFinanceiro').getContext('2d');
const grafico = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Receitas', 'Despesas'],
        datasets: [{
            label: 'Total (R$)',
            data: [3000, 1200],
            backgroundColor: ['#198754', '#dc3545']
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: { beginAtZero: true }
        }
    }
});

let totalReceitas = 3000;
let totalDespesas = 1200;

function formatarParaReal(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function atualizarSaldo() {
    const saldo = totalReceitas - totalDespesas;
    const saldoElement = document.getElementById('saldoAtual');
    saldoElement.textContent = formatarParaReal(saldo);
}


document.getElementById('formLancamento').addEventListener('submit', function(e) {
    // Esconde alerta de erro se visível
    const alertaErro = document.getElementById('alertaErro');
    alertaErro.classList.add('d-none');

    e.preventDefault();

    const tipo = document.getElementById('tipo').value;
    const descricao = document.getElementById('descricao').value;
    const valorBruto = document.getElementById('valor').value.replace(/\D/g, '');
    const valor = parseFloat(valorBruto) / 100;
    const dataAtual = new Date().toLocaleDateString();

    
    if (!tipo || !descricao.trim() || isNaN(valor) || valor <= 0) {
        alertaErro.textContent = "Preencha todos os campos corretamente com um valor positivo.";
        alertaErro.classList.remove('d-none');
        return;
    }

        const tabela = document.getElementById('tabelaLancamentos').querySelector('tbody');
        const novaLinha = tabela.insertRow(0);

        novaLinha.innerHTML = `
            <td>${dataAtual}</td>
            <td>${tipo}</td>
            <td>${descricao}</td>
            <td class="${tipo === 'Receita' ? 'text-success' : 'text-danger'}">
                ${tipo === 'Receita' ? '+ ' : '- '}${formatarParaReal(valor)}
            </td>
        `;

        if (tipo === 'Receita') {
            totalReceitas += valor;
        } else {
            totalDespesas += valor;
        }

        grafico.data.datasets[0].data = [totalReceitas, totalDespesas];
        grafico.update();
        atualizarSaldo();

        const alerta = document.getElementById('alerta');
        alerta.classList.remove('d-none');
        setTimeout(() => alerta.classList.add('d-none'), 3000);

        document.getElementById('formLancamento').reset();
});

const campoValor = document.getElementById('valor');
campoValor.addEventListener('input', function(e) {
    let v = e.target.value.replace(/\D/g, '');
    v = (v / 100).toFixed(2) + '';
    v = v.replace(".", ",");
    v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    e.target.value = "R$ " + v;
});

atualizarSaldo();
