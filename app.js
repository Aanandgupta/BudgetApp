
var budgetController=(
    function(){
        var Income,Expense;
        Expense = function(id,description,value){
                this.id=id;
                this.description=description;
                this.value=value;
                this.percentage=-1;
        };
        Expense.prototype.calcPercentage=function(totaIncome){
            if(totaIncome>0){
                this.percentage=Math.round((this.value/totaIncome)*100);
            }
            else{
                this.percentage=-1;
            }
        };
        Expense.prototype.getPercentage=function(){
            return this.percentage;
        };
        Income=function(id,description,value)       
        {
                this.id=id;
                this.description=description;
                this.value=value;    
            
            };
        var calculateTotal=function(type){
            var sum=0;
            data.allItems[type].forEach(function(cur){
                sum+=cur.value;
            })

            data.totals[type]=sum;
        };

        var data={
            allItems:{
                exp:[],
                inc:[]
            },
            totals:{
                exp:0,
                
                inc:0
            },
            budget:0,
            percentage:-1
        };

        return{
            addItem:function(type,des,value){
                var newItem,ID;
                //creaye new id
                if(data.allItems[type].length>0)
                {
                    ID=data.allItems[type][data.allItems[type].length-1].id+1;
                }
                else
                {
                    ID=0;
                }
    
                //ct=reate new based on inc or exp type
                if(type==='exp'){
                    newItem=new Expense(ID,des,value);
                }
                else if(type==='inc'){
                    newItem=new Income(ID,des,value);
                }
                //push the new item
                data.allItems[type].push(newItem);
                //retrun the new itrem
                return newItem;

            },   
            deleteItem:function(type,id){
                var ids,index;
                ids=data.allItems[type].map(function(current){
                   return current.id;
                });
                index=ids.indexOf(id);
                if(index!==-1){
                    data.allItems[type].splice(index,1);
                }

            },
            
            calculateBudget:function(){
                //calculate total income and expenses
                calculateTotal('exp');
                calculateTotal('inc');
                 //calculate totl budget
                 data.budget=data.totals.inc-data.totals.exp;
                 // clavulta total percentage
                 if(data.totals.inc>0){
                    data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);
                 }
                 else{
                    data.percentage=-1;
                 }
                
                },

            calculatePercentages:function(){
                data.allItems.exp.forEach(function(cur){
                    cur.calcPercentage(data.totals.inc);
                            
                });
             },
             getPercentages:function(){
                 var allPerc=data.allItems.exp.map(function(cur){
                     return cur.getPercentage();
                });
                return allPerc;
             },
            getBudget:function(){
                return{
                    budget: data.budget,
                    totalInc:data.totals.inc,
                    totalExp:data.totals.exp,
                    percentage:data.percentage
                };

            },
                
                testing:function(){
                console.log(data);
            }

        };
        
       
    }
)();



var UIController=(
    function(){
        var Domstrings={
            inputType:'.add__type',
            inputDescription:'.add__description',
            inputValue:'.add__value',
            inputBtn:'.add__btn',
            incomeContainer:'.income__list',
            expensesContainer:'.expenses__list',
            budgetLabel:'.budget__value',
            incomeLabel:'.budget__income--value',
            expenseLabel:'.budget__expenses--value',
            percentageLabel:'.budget__expenses--percentage',
            container:'.container'
        };

        var formatNumber=function(num,type)
        {
            var numSplit,int,dec;
            num=Math.abs(num);
            num=num.toFixed(2);
            numSplit=num.split('.');
            int=numSplit[0];
            dec=numSplit[1];
            if(int.length>3){
                int=int.substr(0,int.length-3)+','+int.substr(int.length-3,3);
            }
            return type==='exp'?'-'+int+'.'+dec:'+'+int+'.'+dec;



        };
        return {
            getInput:function(){
            return{
            type:document.querySelector(Domstrings.inputType).value,
            description:document.querySelector(Domstrings.inputDescription).value,
            value:parseFloat(document.querySelector(Domstrings.inputValue).value)

            };
            },
            clearFields:function() {
                var fields,fieldsArr;
                fields=document.querySelectorAll(Domstrings.inputDescription + ', ' + Domstrings.inputValue);
                fieldsArr=Array.prototype.slice.call(fields);
                fieldsArr.forEach(function(current,index,array) {
                    current.value="";
                });
                fieldsArr[0].focus();
            },
            displayBudget:function(obj){
                var type;
                obj.budget>0?type='inc':type='exp';
                document.querySelector(Domstrings.incomeLabel).textContent=formatNumber(obj.totalInc,'inc');
                document.querySelector(Domstrings.expenseLabel).textContent=formatNumber(obj.totalExp,'exp');
                document.querySelector(Domstrings.budgetLabel).textContent=formatNumber(obj.budget,type);
                if(obj.percentage>0){
                    document.querySelector(Domstrings.percentageLabel).textContent=obj.percentage+'%';
                }
                else{
                    document.querySelector(Domstrings.percentageLabel).textContent='---';
                }
                
            },
            displayPercentage:function(percentages){
                var fields=document.querySelectorAll(".item__percentage");
                var nodeListForEach=function(list,callback){
                    for(var i=0;i<list.length;i++){
                        callback(list[i],i);
                    }

                };
                nodeListForEach(fields,function(cur,index){
                    if(percentages[index]>0){
                        cur.textContent=percentages[index]+"%";
                    }
                    else
                    {
                        
                        cur.textContent="---";

                    }

                });

            },
            addListItem:function(obj,type){
                //1 create an html string
                var html,newHtml,element;
                if(type==='exp')
                {
                    element=Domstrings.expensesContainer;
                    html=html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                }
                else if(type==='inc')
               {
                element=Domstrings.incomeContainer;
                   html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
               }
                //2 replace with actual text
                newHtml=html.replace("%id%",obj.id);
                newHtml=newHtml.replace("%description%",obj.description);
                newHtml=newHtml.replace("%value%",formatNumber(obj.value,type));
                 
                //3 insert in dom tree
               document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);

            },
            deleteListItem:function(itemID){
                var el;
                el=document.getElementById(itemID);
                el.parentNode.removeChild(el);
            },

            getDomstrings:function(){


                return Domstrings;
            }
            };
        
    }
)();



var controller=(function(budgetCtrl,UIctrl){
        var setUpEventListners=function(){
            var DOM=UIctrl.getDomstrings();
            document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);     
            document.addEventListener('keypress',function(event){
           if(event.which === 13||event.keyCode === 13)
           {
              ctrlAddItem();

           }
        });

        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
        };
        var updateBudget=function(){
            budgetCtrl.calculateBudget();
            // get budget
            var budget=budgetCtrl.getBudget();
            //update on ui
            UIctrl.displayBudget(budget);
        };
        var updatePercentages=function(){
            //1. calculate percentages
            budgetCtrl.calculatePercentages();
            //2. get percentages
            var percentages=budgetCtrl.getPercentages();
            //3 display on user interface
            UIctrl.displayPercentage(percentages);
        }
        var ctrlAddItem=function () {
            var input,newItem;
            // 1. get input from ui
            input=UIctrl.getInput();

            if(input.description!=="" && !isNaN(input.value) && input.value!==0){
                // 2. add items
            newItem=budgetCtrl.addItem(input.type,input.description,input.value);

            //3 add items to ui
            UIctrl.addListItem(newItem,input.type);

            //4 clear fields

            UIctrl.clearFields();

            //5 display nad update budget

            updateBudget();
            }        
            //6 dispaly amnd update percebtages
            updatePercentages();
        };

        var ctrlDeleteItem=function(event){
            var itemID,splitID,type,ID;
            itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;
            if(itemID)
            {
                splitID=itemID.split('-');
                type=splitID[0];
                ID=parseInt(splitID[1]);
                //delete the item from data structure
                budgetCtrl.deleteItem(type,ID);
                //delete the item from ui

                UIctrl.deleteListItem(itemID);
                //update the budget
                updateBudget();
                //6 dispaly amnd update percebtages
                updatePercentages();
            }
        };
        return{
            init:function()
            {console.log('started'),
            UIctrl.displayBudget({
                budget: 0,
                totalInc:0,
                totalExp:0,
                percentage:-1
            });
            setUpEventListners()
        }
        };
        
    }
)(budgetController,UIController);

controller.init()