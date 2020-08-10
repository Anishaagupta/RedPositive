const db = firebase.firestore();

var currentUserId = document.getElementById("body").className;
var tableRow = document.getElementById("row");
var componentSelector = document.getElementById("updatecomponent");
var updateButton = document.getElementById("update");


// Fetching the component data from firebase

function loadComponents(){

    var componentsArray = [];

    db.collection('bloodbank').doc(currentUserId).get().then(function(doc){
        doc.data().components.forEach(function(comp){
            componentsArray.push(comp);
        });

        componentsArray.forEach((component) => {
            tableRow.innerHTML += "<tr id='" + component + "'></tr>";
            componentSelector.innerHTML += "<option value='" + component + "'>" + component + "</option>";
        });

        var wb_ap, wb_an, wb_bp, wb_bn, wb_abp,  wb_abn, wb_op, wb_on, wb_bom, check;

        componentsArray.forEach((component) => {
            db.collection("bloodbank/" + currentUserId + "/components/" + component + "/bloodgroups").get().then(function(bloodgroup){
                wb_ap=0;wb_an=0;wb_bp=0;wb_bn=0;wb_abp=0;wb_abn=0;wb_op=0;wb_on=0;wb_bom=0; 
                check = false;
                // If bloodgroup doesn't exist, control does not go inside
                bloodgroup.forEach(function(bg){
                    if(bg.data().bloodGroup === "A+"){
                        wb_ap = bg.data().quantity;
                        check = true;
                    } else if(bg.data().bloodGroup === "A-"){
                        wb_an = bg.data().quantity;
                        check = true;
                    } else if(bg.data().bloodGroup === "B+"){
                        wb_bp = bg.data().quantity;
                        check = true;
                    } else if(bg.data().bloodGroup === "B-"){
                        wb_bn = bg.data().quantity;
                        check = true;
                    } else if(bg.data().bloodGroup === "AB+"){
                        wb_abp = bg.data().quantity;
                        check = true;
                    } else if(bg.data().bloodGroup === "AB-"){
                        wb_abn = bg.data().quantity;
                        check = true;
                    } else if(bg.data().bloodGroup === "O+"){
                        wb_op = bg.data().quantity;
                        check = true;
                    } else if(bg.data().bloodGroup === "O-"){
                        wb_on = bg.data().quantity;
                        check = true;
                    } else if(bg.data().bloodGroup === "Bombay"){
                        wb_bom = bg.data().quantity;
                        check = true;
                    }
                    document.getElementById(component).innerHTML = "<td class='danger'>" + bg.data().componentName + "</td>" + "<td>" + wb_ap+ "</td>" + "<td>" + wb_an + "</td>" + "<td>" + wb_bp + "</td>" + "<td>" + wb_bn + "</td>" + "<td>" + wb_abp + "</td>" + "<td>" + wb_abn + "</td>" + "<td>" + wb_op + "</td>" + "<td>" + wb_on + "</td>" + "<td>" + wb_bom + "</td>";
                });     
                
                if(check == false)
                    document.getElementById(component).innerHTML = "<td class='danger'>" + component + "</td>" + "<td>" + wb_ap+ "</td>" + "<td>" + wb_an + "</td>" + "<td>" + wb_bp + "</td>" + "<td>" + wb_bn + "</td>" + "<td>" + wb_abp + "</td>" + "<td>" + wb_abn + "</td>" + "<td>" + wb_op + "</td>" + "<td>" + wb_on + "</td>" + "<td>" + wb_bom + "</td>";
            });
        });
    });
}



// Updating the component data in firebase

updateButton.addEventListener('click', (e) => {
    e.preventDefault();
    var bbcomponent = document.getElementById("updatecomponent").value;
    var bloodGroup = document.getElementById("updatebg").value;
    var quantity = document.getElementById("compqty").value;

    var currentQty = 0;
    var total = 0;

    db.collection('bloodbank')
    .doc(currentUserId)
    .collection('components')
    .doc(bbcomponent)
    .collection('bloodgroups')
    .doc(bloodGroup)
    .get()
    .then(function(doc){
        if(doc.data() == undefined)
            currentQty = 0;
        else 
            currentQty = doc.data().quantity;
        total = +currentQty + +quantity;
        db.collection('bloodbank')
        .doc(currentUserId)
        .collection('components')
        .doc(bbcomponent)
        .collection('bloodgroups')
        .doc(bloodGroup)
        .set({
            componentName: bbcomponent,
            bloodGroup: bloodGroup,
            quantity: total
        })
        .then(function(){
            window.alert("Update successful!");
            location.reload();
        })
        .catch((error) => {
            console.log(error.message);
        })
    })
    .catch((error) => {
        console.log(error.message);
    })
});