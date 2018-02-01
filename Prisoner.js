var name, age, address, category, charge;

module.exports = class Prisoner {
    constructor(name, age, address, category, charge){
        this.name = name;
        this.age = age;
        this.address = address;
        this.category = category;
        this.charge = charge;
    }

    getName() {
        return this.name;
    }
    getAge() {
        return this.age;
    }
    getAddress(){
        return this.address;
    }
    getCategory(){
        return this.category;
    }
    getCharge(){
        return this.charge;
    }
    printString(){
        return "Name:"+ this.name+" Age:"+this.age+" Address:"+this.address+" Category:"+this.category+" Charge:"+this.charge;
    }
};