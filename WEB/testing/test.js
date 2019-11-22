
         function AppViewModel() {
            this.firstString = ko.observable("Enter First String");
            this.secondString = ko.observable("Enter Second String");

            this.thirdString = ko.computed(function() {
               return this.firstString() + " " + this.secondString();
            }, this);
         }

         // Activates knockout.js
         ko.applyBindings(new AppViewModel());