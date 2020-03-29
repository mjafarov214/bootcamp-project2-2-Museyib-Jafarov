class Application {
    constructor() {
        const self = this;
        document.getElementById('for-deposit').addEventListener('click', function () {
            self.runProcess();
        });
    }
    runProcess() {
        document.getElementById('final-result-table').innerHTML = ``;
        let deposit = new Deposit();
        document.getElementById('red-tag-three').innerHTML = '';
        document.getElementById('red-tag-two').innerHTML = '';
        document.getElementById('red-tag-one').innerHTML = '';
        let checkCurrentValue = false;
        let checkRefill = false;
        let checkTime = false;
        if (deposit.cv > 0) {
            checkCurrentValue = true;
        } else {
            alert('Начальная сумма неверный формат');
            document.getElementById('red-tag-one').innerHTML = '&#9888;';
        }
        if (deposit.refill >= 0) {
            checkRefill = true;
        } else {
            alert('Сумма ежемесячного пополнения неверный формат');
            document.getElementById('red-tag-two').innerHTML = '&#9888;';
        }
        if (deposit.time > 0 && deposit.time <= 24 && Math.trunc(deposit.time) == deposit.time) {
            checkTime = true;
        }
        else {
            alert('Срок вклада неверный формат');
            document.getElementById('red-tag-three').innerHTML = '&#9888;';
        }
        if (checkCurrentValue === true && checkRefill === true && checkTime === true) {
            //console.log(deposit);
            let calculator = new Calculator;
            let bestOffer = calculator.findOffer(deposit);
            if (bestOffer.length === 0) {
                return;
            }
            //console.log(bestOffer);
            let maxOffer = calculator.getMaxBank(bestOffer);
            //console.log(maxOffer);
            let fv = calculator.calculateDeposit(deposit, maxOffer);
            //console.log(fv);
            this.makeTable(maxOffer, fv);
        }
    }
    makeTable(maxoffer, fv) {
        let finalResultTable = document.getElementById('final-result-table');
        let tableHead = '<tr><th>Название Банка</th><th>Вклад</th><th>Процент</th><th>Итоговая сумма</th></tr>';
        let tableMain = '';
        for (let i = 0; i < maxoffer.length; i++) {
            let tableRow = `<tr><td>${maxoffer[i].bankName}</td><td>${maxoffer[i].investName}</td><td>${maxoffer[i].incomeType}</td><td>${fv}</td></tr>`;
            tableMain += tableRow;
        }
        finalResultTable.innerHTML = `<table>${tableHead}${tableMain}</table>`;
    }
}
class Deposit {
    constructor() {
        this.cv = +(document.getElementById('cv').value);
        this.refill = +(document.getElementById('refill').value);
        this.time = +(document.getElementById('time').value);
        this.valute = document.getElementById('valute').value;
    }
}
class Calculator {
    constructor() { }
    calculateDeposit(deposit, maxOffer) {
        let percentInd = maxOffer[0].incomeType / 100 / 12;
        let finalResult = deposit.cv + (deposit.cv * percentInd);
        let plusAmount = 0;
        for (let i = 0; i < (Math.trunc(deposit.time - 1)); i++) {
            plusAmount = (finalResult + deposit.refill) * percentInd + deposit.refill;
            finalResult += plusAmount;
        }
        return Math.round(finalResult);
    }
    findOffer(client) {
        const bank = new BankProduct();
        //console.log(bank);
        const bankOffer = bank.res.filter(function (item) {
            if (client.refill > 0) {
                return client.cv >= item.sumMin
                    && (client.cv <= item.sumMax || item.sumMax == null)
                    && client.time >= item.termMin
                    && client.time <= item.termMax
                    && item.canDeposit === true
                    && client.valute == item.currency;
            } else if (client.refill == 0) {
                return client.cv >= item.sumMin
                    && (client.cv <= item.sumMax || item.sumMax == null)
                    && client.time >= item.termMin
                    && client.time <= item.termMax
                    && client.valute == item.currency;
            }
        });
        if (bankOffer.length == 0) {
            alert('По вашему запросу предложений нет!');
        }
        return bankOffer;
    }
    getMaxBank(bestOffer) {
        let maxPercent = bestOffer.reduce(function (prev, cur) {
            if (prev.incomeType > cur.incomeType) {
                return prev;
            }
            return cur;
        });
        let maxPercentSame = bestOffer.filter(function (item) {
            return item.incomeType == maxPercent.incomeType;
        });
        return maxPercentSame;
    }
}
class BankProduct {
    constructor() {
        this.res = Array.from(globalArray);
    }
}

new Application();