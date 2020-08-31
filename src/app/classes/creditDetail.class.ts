export class CreditDetail{
    private interestRate: number;
    private amount: number;
    private registerDate: Date;
    private gastoNotarial: number;
    private tax: number;
    private uf: number;
    private months: number;
    private payment:number;
    private paymentNumber: number;
    private projectedDays: number;
    private severance: number; // TASA CESANTIA
    private projectedAmount:number;
    
    constructor(){
        
    }
    setPayment(payment: number){
        this.payment = payment
    }
    getPayMent(payment: number){
        return this.payment;
    }
    setPaymentNumber(paymentNumber: number){
        this.paymentNumber = paymentNumber; 
    }
    getPaymentNumber(){
        return this.paymentNumber;
    }
    setSeverance(severance: number){
        this.severance = severance;
    }

    getSeverance(){
        return this.severance;
    }
    setMonths(months: number){
        this.months = months;
    }
    getMonths(){
        return this.months;
    }

    getProjectedDays(){
        return this.projectedDays;
    }

    setInterestRate(interestRate: number){
        this.interestRate = interestRate / 100;
    }

    getInterestRate(){
        return this.interestRate;
    }
    setAmount(amount: number){
        this.amount = amount;
    }

    setRegisterDate(registerDate: any){
        this.registerDate = registerDate;
    }
    setGastoNotarial(gastoNotarial: number){
        this.gastoNotarial = gastoNotarial;
    }
    setTax(tax: number){
        this.tax = tax;
    }
    setUf(uf: number){
        this.uf = uf;
    }
    getUf(){
        return this.uf;
    }
    prepareProjectedDays(months: number){
        const now = new Date();
        const year = now.getFullYear()
        const currentMonth = now.getMonth()
        const thisDay = now.getDate();
        const lastDayInCurrentMonth = new Date(year, currentMonth + 1, 0).getDate();
        const daysUntilEndOfMonth = lastDayInCurrentMonth - thisDay;
        let monthsDays = 0;
        for (let index = 0; index < months; index++) {
          const daysInMonth = new Date(year, currentMonth + index, 0).getDate();
          monthsDays += daysInMonth;
        }
        this.projectedDays =  monthsDays + 1 + daysUntilEndOfMonth;
    }

    prepareCalcs(){
        this.prepareProjectedDays(this.months);
        this.prepareProjectedAmount();
    }


    prepareProjectedAmount(){
        this.projectedAmount = Math.round(this.projectedDays / 30 * this.interestRate * this.amount);
    }
    getProjectedAmount(){
        return this.projectedAmount;
    }
}