//BUDGET CONTROLLER
let budgetController = (function (){
    //function constructor of expenses and incomes
    let Incomes = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;

    };
    let Expenses = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    Expenses.prototype.calcPercentages = function(totalInc){
        this.percentage = Math.round((this.value / totalInc) * 100);
    };
    Expenses.prototype.getPercentages = function(){
        return this.percentage;
    };
    
    
    let calulateTotal = function(type){
        let sum = 0;
        // data.allItems[type].forEach(element => {
        //     console.log(element)
        //     console.log(data.allItems[type].length + 'dsadasdasdsa')
        //     console.log(data.allItems[type][0].value)
        // });
        //Con for
        // for(i = 0; i < data.allItems[type].length; i++){
        //     let  item =data.allItems[type][i].value;
        //     sum = sum + item;
        //     console.log(sum)
        // }
        // data.totals[type] = sum;
        //Con forEach -> màs eficiente
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
        
        
    }
    
    let data = {
        allItems : {
            exp : [],
            inc : []
        },
        totals : {
            exp : 0,
            inc : 0
        },
        budget : 0,
        percentage : -1 
    };

    return {
        addItem : function(type,des,val){
            let newItem, ID ;

            //CREATE NEW ID
            if(data.allItems[type].length > 0){
                ID = data.allItems[type].length ;
            }else{
                ID = 0;
            }
            //CREATED NEW ITEM BASES ON 'inc' OR 'exp' TYPE
            if(type === 'exp'){
                newItem = new Expenses(ID,des,val);
            }else{
                newItem = new Incomes(ID,des,val)
            }

            //PUSH IT INTO DATA STRUCTURE
            data.allItems[type].push(newItem);

            //RETURN THE NEW ELEMENT
            return newItem;
        },
        deleteItem: function(type, ID){
            // console.log()
            // [0,1,2,5,8]
            // console.log({type,ID})
            // console.log(data.allItems[type])
            // let itemsID = data.allItems[type].map((current)=>{
            //     return current.id;
            // });
            
            // // if(index !== -1){
            // //     data.allItems[type].splice(index,1)
            // // }

            // //METHOD TO DELETE ITEM FROM ARRAY
            // //desde donde se empieza a eliminar / cuantos elementos del array
            // data.allItems[type].splice(ID,1); //id
            // console.log(data.allItems[type]);   //array sin elemento eliminado 
            
            // id = 6
            //data.allItems[type][id];
            // ids = [1 2 4  8]
            //index = 3
            
            let ids, index;
            ids = data.allItems[type].map(function(current) {   //with the id`s of the
                console.log(current.id);                        //data.allItems in a variable ids
                return current.id;
            });
            //                                                  //en el nuevo array ids buscamos el index
            index = ids.indexOf(ID);                            //que sea igual al ID para que pueda ser eliminado del budget
            //                                                  // y el total pueda actualizarse
            
            if (index !== -1) {                                 //verificamos la existencia de elementos
                data.allItems[type].splice(index, 1);           //eliminamos el elemento con el metodo .splice
            }

            

        },
        calculateBudget : function(){
            //calculate total incomes and expenses
            calulateTotal('inc')
            calulateTotal('exp')
            //calculate the budget : income - expenses
            data.budget = data.totals.inc - data.totals.exp 
            //calculate the percentage of income that we spent
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }else{
                data.percentage = -1;
            }
        },
        calculatePercentages : function(){
            data.allItems.exp.forEach(function(currrentElement) {
                currrentElement.calcPercentages(data.totals.inc);
            });
        },
        getPercentages : function(){
            var allPerc = data.allItems.exp.map(function(currrentElement) {
                return currrentElement.getPercentages();
            });
            return allPerc;
        },
        getButget: function(){
            return { 
                budget : data.budget,
                totalInc : data.totals.inc,
                totalExp : data.totals.exp,
                percentage : data.percentage
            }
        },
        
        
        testing : function(){
            console.log(data)
        }
    };

})();

//UI CONTROLLER
let UIController = (function(){
    //some code
    let DOMStrings = {
        inpuType : '.add__type',
        inputDescription : '.add__description',
        inputValue:'.add__value',
        inputBtn : '.add__btn',
        expensesContainer : '.expenses__list',
        incomesContainer : '.income__list',
        budgetLabel : '.budget__value',
        incomeTotalLabel : '.budget__income--value',
        expenseTotalLabel : '.budget__expenses--value',
        percentageLabel : '.budget__expenses--percentage',
        container : '.container',
        labelPercentages : '.item__percentage',
        labelMonth: '.budget__title--month'
    };
    let formatNumber = function(number){
        let int,dec,firstInt,secondInt;
        /*1500 -> 1500.00 
          1500.00 -> 1,500.00  */
        number = number.toFixed(2);
        number = number.split('.')
        int = number[0];
        dec = number[1];
        if(int.length > 3){
            int = int.substring(0,int.length-3) + ',' + int.substring(1);
        }
        return int +'.'+ dec
    };

    let nodeListForEach = function(list,callback){
        for(i = 0; i < list.length; i++){
            callback(list[i],i)
        };                                                          
    };

    return {
        getInputData : function(){
            return {
                type : document.querySelector(DOMStrings.inpuType).value,
                description : document.querySelector(DOMStrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMStrings.inputValue).value)

            }
        },
        getDOMStrings: function(){
            return DOMStrings;
        },
        displayMonth:function(){
            let month,year, months;
            let date = new Date;

            year = date.getFullYear();
            month = date.getMonth();
            months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

            document.querySelector(DOMStrings.labelMonth).textContent = `${months[month]} of ${year}`
        },
        diaplayPercentages : function (percentages){
            let fields = document.querySelectorAll(DOMStrings.labelPercentages);

                                                                          //haciendo uso de callbacks
            nodeListForEach(fields,function(current,index){
                if(percentages[index] > 0){
                    current.textContent = percentages[index] + '%';
                }else{
                    current.textContent = '---'
                }
            });
        },
        addListItem : function(obj,type){
            let html,element;
            //CREATE HTML STRING WHIT PLACEHOLDER TEXT
            if(type === 'inc'){
                element = DOMStrings.incomesContainer
                html =
                    `<div class="item clearfix" id="inc-${obj.id}">
                        <div class="item__description">${obj.description}</div>
                        <div class="right clearfix">
                            <div class="item__value">+ ${formatNumber(obj.value)}</div>
                            <div class="item__delete">
                                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                            </div>
                        </div>
                    </div>`;
            }else{
                element = DOMStrings.expensesContainer; 
                html =
                    `<div class="item clearfix" id="exp-${obj.id}">
                        <div class="item__description">${obj.description}</div>
                        <div class="right clearfix">
                            <div class="item__value">- ${formatNumber(obj.value)}</div>
                            <div class="item__percentage">${obj.percentage}</div>
                            <div class="item__delete">
                                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                            </div>
                        </div>
                    </div>`
            }

            //INSERT THE HTML INTO DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',html)
        },
        deleteListItem : function(itemID) {
            let el = document.getElementById(itemID);
            el.parentNode.removeChild(el);
        },
        clearfields : function(){
            document.querySelector(DOMStrings.inputDescription).value = '';
            document.querySelector(DOMStrings.inputDescription).focus();
            document.querySelector(DOMStrings.inputValue).value = '';
        },
        displayBudget : function(obj){
            console.log(obj);
            document.querySelector(DOMStrings.budgetLabel).textContent = `+ ${formatNumber(obj.budget)}`;
            document.querySelector(DOMStrings.incomeTotalLabel).textContent = `+ ${formatNumber(obj.totalInc)}`;
            document.querySelector(DOMStrings.expenseTotalLabel).textContent = `- ${formatNumber(obj.totalExp)}`;
            if(obj.percentage > 0){
                document.querySelector(DOMStrings.percentageLabel).textContent = `${obj.percentage} %`;
            }else{
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }
        },
        changeTypes : function(){
            let fields = document.querySelectorAll(`
                                    ${DOMStrings.inpuType} ,
                                    ${DOMStrings.inputDescription} ,
                                    ${DOMStrings.inputValue} `);
            nodeListForEach(fields,function(current){
                current.classList.toggle('red-focus');
            });

            document.querySelector(DOMStrings.inputBtn).classList.toggle('red')
        }
    }
})();

//GLOBAL APP CONTROLLER
let controller = (function(budgetCtlr,UICtrl){
    let setupEventsListeners = function(){
        
        let DOMStrings = UICtrl.getDOMStrings();
        
        document.querySelector(DOMStrings.inputBtn).addEventListener('click',ctlrAddItem);
        document.addEventListener('keypress',function(e){
            if(event.keyCode === 13 || event.which === 13){
                ctlrAddItem();
            };
        });
        document.querySelector(DOMStrings.container).addEventListener('click',ctrlDeleteItem);
        
        document.addEventListener('change',UIController.changeTypes);
    };

    let updatebudget = function(){

        //1. Calculate the budget
        budgetCtlr.calculateBudget()
        //2. Return budget
        let budget = budgetCtlr.getButget()
        //3. Display the budget on the UI
        UICtrl.displayBudget(budget)
        // console.log(budget)
    };

    let updatePercentage = function(){
        budgetCtlr.calculatePercentages();
        // 1. Calculate percentages
        budgetCtlr.calculatePercentages();
        
        // 2. Read percentages from the budget controller
        var percentages = budgetCtlr.getPercentages();
        
        // 3. Update the UI with the new percentages
        UICtrl.diaplayPercentages(percentages);
    };

    let ctlrAddItem = function(){
        let input,newItem;
        //1. Get the field input data
        input = UICtrl.getInputData()
        console.log(input)
        if(input.description !== '' && !isNaN(input.value) && input.value > 0){
            //2. Add the item  to the budget controller
            newItem = budgetCtlr.addItem(input.type,input.description,input.value);
            budgetCtlr.testing()
            //3. Add the item to the UI
            UICtrl.addListItem(newItem,input.type);
            //4. Clear fields
            UICtrl.clearfields();
            //5. Calculate and update budget
            updatebudget();
            //6. Update percentage
            updatePercentage();

        }

    };

    let ctrlDeleteItem = function(event){
        let itemID, spliteID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        spliteID = itemID.split('-');
        type = spliteID[0];
        ID = parseInt(spliteID[1]);
        
        //1. Delete the item from the data structure
        budgetCtlr.deleteItem(type,ID)
        //2. Delete the item from the UI
        UICtrl.deleteListItem(itemID);
        //3. Update and show the new budget
        updatebudget();
        //6. Update percentage
        updatePercentage();
        //

    }
    return {
        init : function(){
            console.log('aplication started');
            setupEventsListeners(); 
            UIController.displayMonth();
        }
    }
})(budgetController,UIController);

controller.init();