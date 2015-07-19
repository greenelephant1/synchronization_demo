function NoneAlgorithm (){
    this.enter_critical_section = function() {
        return true;
    };

    this.exit_critical_section = function() {
    };

    this.check_availablilty = function() {
        return true;
    };
}

function PetersonsAlgorithm (){
    var flag = new Object();
    var turn;
    var this_algorithm = this;

    this.check_availablilty = function() {

        if(flag[this.other_color] && turn == this.other_color){
            return false;
        } else {
            return true;
        }
    };

    this.enter_critical_section = function() {
        flag[this.color] = true;
        turn = this.other_color;

        return this_algorithm.check_availablilty.call(this);
    };

    this.exit_critical_section = function() {
        flag[this.color] = false;
    };
}


