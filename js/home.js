

export class homeMeals {

    constructor() {

        this.mealRow = document.getElementById("homeMealRow");

        this.getMeals("")

    }

    async getMeals(nameOfMeal) {

        let myRequest = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${nameOfMeal}`);

        let myResponse = await myRequest.json();

        this.displayTheMeals(myResponse.meals);

    }

    displayTheMeals(allMeals) {

        let temp = ""
        allMeals.forEach(element => {

            temp += `
                <div class=" col-md-3" >
                <div (click)="getMealID(${element.idMeals})" class="itemMeal" >
                  <img src="${element.strMealThumb}" class=" w-100" alt="">
                  <div class="innerBox d-flex justify-content-center align-items-center">
                    <h2>${element.strMeal}</h2>
                  </div>
                </div>
              </div>
              `

        });


        this.mealRow.innerHTML = temp

    }

    getMealID(mealID) {
        console.log(mealID);
    }


}







