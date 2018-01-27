var name, age, address, category, charge;
function Prisoner(name, age, address, category, charge){

    this.name = name;
    this.age = age;
    this.address = address;
    this.category = category;
    this.charge = charge;
}

Prisoner.prototype.getName = function(){
    return this.name;
}
Prisoner.prototype.getAge = function(){
    return this.age;
}
Prisoner.prototype.getAddress = function(){
    return this.address;
}
Prisoner.prototype.getCategory = function(){
    return this.category;
}
Prisoner.prototype.getCharge = function(){
    return this.charge;
}

module.exports = Prisoner;