

  function vibration() {
   var time = 500;
   navigator.vibrate(time);
  }

  function create_toast(msg){
    app.toast.create({
        text: msg,
        position: 'bottom',
        closeTimeout: 3000
    }).open();
  }


  function display_categories(){
    let categories = JSON.parse(sessionStorage.getItem("category"));

    let tr = '';
    for(let i = 0; i < categories.length; i++){
        tr += "<tr><td>"+categories[i].category+"</td></tr>";
    }

    $("#the-cats").html(tr);
  }


  function updateManager(){
    if(sessionStorage.getItem("user_id") == "" || sessionStorage.getItem("user_id") == null){
        window.location = "index.html";
    }
      $(".manager-name").html(sessionStorage.getItem("name"));
      $(".branch-name").html(sessionStorage.getItem("branch"));
  }

  function updateCustomer(){
      if(sessionStorage.getItem("customer_id") == "" || sessionStorage.getItem("customer_id") == null){
          window.location = "index.html";
      }
      $(".customer-name").html(sessionStorage.getItem("name"));
      $(".branch-name").html(sessionStorage.getItem("branch"));
  }

  function updateAdmin(){
      if(sessionStorage.getItem("admin") == "" || sessionStorage.getItem("admin") == null){
          window.location = "index.html";
      }

  }


  function getImage(image,width, h=width){
      let img = image.split("/");
      img = img[8];
      img = "https://res.cloudinary.com/onlinemedia234/image/upload/w_"+width+",h_"+h+",c_fill/stock/"+img;

      return img;
  }


  /*function doit(type, id, fn, dl) {
      var elt = document.getElementById(id);
      var wb = XLSX.utils.table_to_book(elt, {sheet:"Sheet 1"});
      return dl ?
          XLSX.write(wb, {bookType:type, bookSST:true, type: 'base64'}) :
          XLSX.writeFile(wb, fn || ('Vanguard.' + (type || 'xlsx')));
  }*/





  $$(document).on('page:init', function (e) {
	    var page = e.detail;
	    //console.log(page);
	    // Code for About page

	  	if(page.name === "register"){
            $("body").off("click",".finish-reg").on("click", ".finish-reg", function(e) {
                e.preventDefault();

                //Get all vars
                var username = $("#reg-username").val();
                var name = $("#reg-name").val();
                var password = $("#reg-password").val();
                var email = $("#reg-email").val();
                var phone = $("#reg-phone").val();

                if((name == "") || (password == "") || (email == "") || (phone == "") || (username == "")){
                    create_toast("All fields are required...");
                    vibration();

                    return;
                }

                //create ajax to submit form
                app.dialog.preloader('Please wait, while we complete your registration!');
                $.ajax({
                    url: url,
                    type: 'post',
                    dataType: 'json',
                    crossDomain: true,
                    timeout: 30000,
                    data: {
                        'reg-ok': '',
                        'username': username,
                        'name': name,
                        'password': password,
                        'email': email,
                        'phone': phone
                    },
                    success: function (f) {
                        app.dialog.close();
                        if(f.ok == 1){
                            $("#reg-username").val("");
                            $("#reg-name").val("");
                            $("#reg-password").val("");
                            $("#reg-email").val("");
                            $("#reg-phone").val("");


                            var t = app.toast.create({
                                text: f.msg,
                                position: 'center',
                                closeTimeout: 3000
                            }).open();
                            mainView.router.navigate("/login/",{});
                        }else{
                            var t = app.toast.create({
                                text: f.msg,
                                position: 'bottom',
                                closeTimeout: 3000
                            }).open();
                        }


                    },
                    error: function (e) {
                        app.dialog.close();
                        console.log(e);
                        app.toast.create({
                            text: 'Network error, please ensure that you have active internet connections!',
                            position: 'bottom',
                            closeTimeout: 3000
                        }).open();
                        vibration();

                    }
                });


            });
		}


		if(page.name === "login"){
            $("body").on("click",".btn-login",function (e) {
                e.preventDefault();
                var router = this.$router;

                var username = $(".user-name").val();
                var password = $(".user-password").val();

                if (username == "" || password == "") {

                    app.toast.create({
                        text: 'Please fill all fields',
                        position: 'center',
                        closeTimeout: 3000
                    }).open();
                    //self.toastIcon.open();
                    vibration();

                    return false;
                }
                $("#signIn-btn").hide();
                $("#loader").removeClass('hide');

                //ajax login
                $.ajax({
                    url: url,
                    type: 'post',
                    dataType: 'json',
                    crossDomain: true,
                    timeout: 45000,
                    data: {
                        'login-ok': '',
                        'username': username,
                        'password': password
                    },
                    success: function(f) {
                        //console.log(f);
                        if (f.ok == 0) {
                            app.toast.create({
                                text: f.msg,
                                position: 'center',
                                closeTimeout: 3000
                            }).open();
                            vibration();
                            $("#signIn-btn").show();
                            $("#loader").addClass('hide');
                        }else {
                            //console.log(f.datas);
                            //return;
                            var category = JSON.stringify(f.category);
                            //var my_auctions = JSON.stringify(f.my_auctions);
                            //console.log(chats_lists);
                            sessionStorage.setItem("category",category);
                            sessionStorage.setItem("user_id", f.datas['id']);
                            sessionStorage.setItem("username", f.datas['username']);
                            sessionStorage.setItem("name", f.datas['name']);
                            sessionStorage.setItem("email", f.datas['email']);
                            sessionStorage.setItem("phone", f.datas['phone']);
                            var my_auctions = JSON.stringify(f.my_auctions);
                            sessionStorage.setItem("my_auctions", my_auctions);
                            $("#signIn-btn").show();
                            $("#loader").addClass('hide');
                            mainView.router.navigate("/home/",{});
                        }
                    },
                    error: function(e) {
                        app.toast.create({
                            text: 'Network error, please ensure that you have active internet connections!',
                            position: 'bottom',
                            closeTimeout: 3000
                        }).open();

                        vibration();
                        //console.log(e.responseText);
                        //alert(e.responseText);
                        $("#signIn-btn").show();
                        $("#loader").addClass('hide');
                    }
                });
            });
        }


      if(page.name === "manager-login"){
          //console.log("yeah!");

          $("body").off('click', '.btn-login').on('click', '.btn-login',function(e) {
              e.preventDefault();
              var router = this.$router;

              var username = $(".user-name").val();
              var password = $(".user-password").val();

              if (username == "" || password == "") {

                  app.toast.create({
                      text: 'Please fill all fields',
                      position: 'center',
                      closeTimeout: 3000
                  }).open();
                  //self.toastIcon.open();
                  vibration();

                  return false;
              }
              $("#signIn-btn").hide();
              $("#loader").removeClass('hide');

              //ajax login
              $.ajax({
                  url: url,
                  type: 'post',
                  dataType: 'json',
                  crossDomain: true,
                  timeout: 45000,
                  data: {
                      'manager-login': '',
                      'username': username,
                      'password': password
                  },
                  success: function(f) {
                      console.log(f);
                      if (f.ok == 0) {
                          app.toast.create({
                              text: f.msg,
                              position: 'center',
                              closeTimeout: 3000
                          }).open();
                          vibration();
                          $("#signIn-btn").show();
                          $("#loader").addClass('hide');
                      }else {
                          //console.log(f.datas);
                          //return;
                          let category = JSON.stringify(f.category);
                          let storeUsers = JSON.stringify(f.users);
                          let storeStocks = JSON.stringify(f.stocks);
                          //var my_auctions = JSON.stringify(f.my_auctions);
                          //console.log(chats_lists);
                          sessionStorage.setItem("category",category);
                          sessionStorage.setItem("user_id", f.datas['id']);
                          sessionStorage.setItem("username", f.datas['username']);
                          sessionStorage.setItem("name", f.datas['name']);
                          sessionStorage.setItem("email", f.datas['email']);
                          sessionStorage.setItem("branch", f.datas['branch_name']+", "+f.datas['location']);
                          sessionStorage.setItem("branch_id",f.datas['branch_id']);
                          sessionStorage.setItem("store_users", storeUsers);
                          sessionStorage.setItem("store_stocks",storeStocks);
                          sessionStorage.setItem("total_category", f.total_cats);
                          sessionStorage.setItem("total_users", f.user_total);
                          sessionStorage.setItem("total_stocks", f.total_stocks);
                          sessionStorage.setItem("total_staff", f.total_staff);

                          //var router = this.$router;
                          $("#signIn-btn").show();
                          $("#loader").addClass('hide');
                          mainView.router.navigate("/manager-home/",{});
                      }
                  },
                  error: function(e) {
                      app.toast.create({
                          text: 'Network error, please ensure that you have active internet connections!',
                          position: 'bottom',
                          closeTimeout: 3000
                      }).open();

                      vibration();
                      //console.log(e.responseText);
                      //alert(e.responseText);
                      $("#signIn-btn").show();
                      $("#loader").addClass('hide');
                  }
              });
          });
      }


      if(page.name === "user-login"){
          //console.log("yeah!");
          $("body").off('click', '.btn-login').on('click', '.btn-login',function(e) {
              e.preventDefault();
              var router = this.$router;

              let username = $("#user-email").val();
              let password = $("#user-phone").val();

              console.log("Username", username, "Password", password);


              if (username == "" || password == "") {

                  app.toast.create({
                      text: 'Please fill all fields',
                      position: 'center',
                      closeTimeout: 3000
                  }).open();
                  //self.toastIcon.open();
                  vibration();

                  return false;
              }
              $("#signIn-btn").hide();
              $("#loader").removeClass('hide');

              //ajax login
              $.ajax({
                  url: url,
                  type: 'post',
                  dataType: 'json',
                  crossDomain: true,
                  timeout: 45000,
                  data: {
                      'user-login': '',
                      'username': username,
                      'password': password
                  },
                  success: function(f) {
                      console.log(f);
                      if (f.ok == 0) {
                          app.toast.create({
                              text: f.msg,
                              position: 'center',
                              closeTimeout: 3000
                          }).open();
                          vibration();
                          $("#signIn-btn").show();
                          $("#loader").addClass('hide');
                      }else {
                          //console.log(f.datas);
                          //return;
                          let category = JSON.stringify(f.category);
                          let storeStocks = JSON.stringify(f.stocks);
                          //var my_auctions = JSON.stringify(f.my_auctions);
                          //console.log(chats_lists);
                          sessionStorage.setItem("category",category);
                          sessionStorage.setItem("customer_id", f.datas['id']);
                          sessionStorage.setItem("name", f.datas['name']);
                          sessionStorage.setItem("email", f.datas['email']);
                          sessionStorage.setItem("phone", f.datas['phone']);
                          sessionStorage.setItem("branch", f.datas['branch_name']+", "+f.datas['location']);
                          sessionStorage.setItem("branch_id",f.datas['branch_id']);
                          sessionStorage.setItem("store_stocks",storeStocks);
                          sessionStorage.setItem("total_category", f.total_cats);
                          sessionStorage.setItem("total_stocks", f.total_stocks);

                          //var router = this.$router;
                          $("#signIn-btn").show();
                          $("#loader").addClass('hide');
                          mainView.router.navigate("/user-home/",{});
                      }
                  },
                  error: function(e) {
                      app.toast.create({
                          text: 'Network error, please ensure that you have active internet connections!',
                          position: 'bottom',
                          closeTimeout: 3000
                      }).open();

                      vibration();
                      //console.log(e.responseText);
                      //alert(e.responseText);
                      $("#signIn-btn").show();
                      $("#loader").addClass('hide');
                  }
              });
          });
      }

      if(page.name === "admin-login"){
          //console.log("yeah!");
          $("body").off('click', '.btn-login').on('click', '.btn-login',function(e) {
              e.preventDefault();
              var router = this.$router;

              let username = $(".user-name").val();
              let password = $(".user-password").val();

              //console.log("Username", username, "Password", password);


              if (username == "" || password == "") {

                  app.toast.create({
                      text: 'Please fill all fields',
                      position: 'center',
                      closeTimeout: 3000
                  }).open();
                  //self.toastIcon.open();
                  vibration();

                  return false;
              }
              $("#signIn-btn").hide();
              $("#loader").removeClass('hide');

              //ajax login
              $.ajax({
                  url: url,
                  type: 'post',
                  dataType: 'json',
                  crossDomain: true,
                  timeout: 45000,
                  data: {
                      'admin-login': '1',
                      'username': username,
                      'password': password
                  },
                  success: function(f) {
                      //console.log(f);
                      if (f.ok == 0) {
                          app.toast.create({
                              text: f.msg,
                              position: 'center',
                              closeTimeout: 3000
                          }).open();
                          vibration();
                          $("#signIn-btn").show();
                          $("#loader").addClass('hide');
                      }else {
                          //console.log(f.datas);
                          //return;
                          sessionStorage.setItem("admin", f.id);
                          sessionStorage.setItem("stats",JSON.stringify(f.records));

                          //var router = this.$router;
                          $("#signIn-btn").show();
                          $("#loader").addClass('hide');
                          mainView.router.navigate("/admin-home/",{});
                      }
                  },
                  error: function(e) {
                      app.toast.create({
                          text: 'Network error, please ensure that you have active internet connections!',
                          position: 'bottom',
                          closeTimeout: 3000
                      }).open();

                      vibration();
                      //console.log(e.responseText);
                      //alert(e.responseText);
                      $("#signIn-btn").show();
                      $("#loader").addClass('hide');
                  }
              });
          });
      }


      if(page.name === "manager-home"){
          updateManager();
          $(".manager-name").html(sessionStorage.getItem("name"));
          $(".branch-name").html(sessionStorage.getItem("branch"));
          $(".total-categories").html(sessionStorage.getItem(("total_category")));
          $(".total-items").html(sessionStorage.getItem(("total_stocks")));
          $(".total-users").html(sessionStorage.getItem(("total_users")));
          $(".total-staff").html(sessionStorage.getItem(("total_staff")));


          $("body").off("click",".logout").on("click",".logout", function (e) {
              app.dialog.confirm("Are you sure you want to logout?","Logout",function (e) {
                  sessionStorage.clear();
                  window.location = "index.html";
              });
          });
      }



      if(page.name === "user-home"){
          updateCustomer();
          $(".manager-name").html(sessionStorage.getItem("name"));
          $(".branch-name").html(sessionStorage.getItem("branch"));
          $(".total-categories").html(sessionStorage.getItem(("total_category")));
          $(".total-items").html(sessionStorage.getItem(("total_stocks")));
          $(".total-users").html(sessionStorage.getItem(("total_users")));
          $(".total-staff").html(sessionStorage.getItem(("total_staff")));


          $("body").off("click",".logout").on("click",".logout", function (e) {
              app.dialog.confirm("Are you sure you want to logout?","Logout",function (e) {
                  sessionStorage.clear();
                  window.location = "index.html";
              });
          });
      }

      if(page.name === "admin-home"){
          updateAdmin();

          let records = sessionStorage.getItem("stats");
          let records_json = JSON.parse(records);
          //console.log(records_json);
          /*$(".manager-name").html(sessionStorage.getItem("name"));
          $(".branch-name").html(sessionStorage.getItem("branch"));
          $(".total-categories").html(sessionStorage.getItem(("total_category")));
          $(".total-items").html(sessionStorage.getItem(("total_stocks")));
          $(".total-users").html(sessionStorage.getItem(("total_users")));
          $(".total-staff").html(sessionStorage.getItem(("total_staff")));*/

          $(".total-categories").html(records_json.categories);
          $(".total-items").html(records_json.stocks);
          $(".total-users").html(records_json.users);
          $(".total-staff").html(records_json.staff);
          $(".total-branch").html(records_json.branches);
          $(".total-in_stock").html(records_json.in_stock);
          $(".total-out_stock").html(records_json.out_of_stock);
          $(".total-almost-out").html(records_json.almost_out);
          //$(".total-branch").html(records_json.branches);




          $("body").off("click",".logout").on("click",".logout", function (e) {
              app.dialog.confirm("Are you sure you want to logout?","Logout",function (e) {
                  sessionStorage.clear();
                  window.location = "index.html";
              });
          });
      }

      if(page.name === "add-branch"){
          updateAdmin();

          $("body").off('submit', '#form-add-branch').on('submit', '#form-add-branch',function(e) {
              e.preventDefault();
              let name = $("#branch-name").val();
              let location = $("#branch-location").val();

              if (name == "" || location == "") {

                  app.toast.create({
                      text: 'All fields are required',
                      position: 'bottom',
                      closeTimeout: 3000
                  }).open();
                  //self.toastIcon.open();
                  vibration();

                  return false;
              }

              $("#loader").removeClass("hide");

              $.ajax({
                  url: url,
                  type: 'post',
                  dataType: 'json',
                  timeout: 45000,
                  data: {
                      'name': name,
                      'location': location,
                      'add-branch': ''
                  },
                  success: function (f) {
                      $("#loader").addClass('hide');
                      if(f.ok == 0){
                          app.toast.create({
                              text: f.msg,
                              position: 'bottom',
                              closeTimeout: 3000
                          }).open();
                          //self.toastIcon.open();
                          vibration();
                      }else{
                          $("#branch-name").val('');
                          $("#branch-location").val();
                          app.toast.create({
                              text: f.msg,
                              position: 'bottom',
                              closeTimeout: 3000
                          }).open();
                          //self.toastIcon.open();
                          vibration();
                          let stats = JSON.stringify(f.records);
                          sessionStorage.setItem("stats",stats);
                          //display_categories();
                      }
                  },
                  error: function (e) {
                      $("#loader").addClass('hide');
                      app.toast.create({
                          text: 'Network error, please try again!',
                          position: 'bottom',
                          closeTimeout: 3000
                      }).open();
                      //self.toastIcon.open();
                      vibration();
                  }
              });
          });
      }


      if(page.name === "edit-branch"){
          updateAdmin();
          app.dialog.preloader('Fetching Branch');

          $.ajax({
             type: 'get',
             dataType: 'json',
             data: {
                 'load-branch': ''
             },
              url: url,
              timeout: 45000,
              success: function (f) {
                  app.dialog.close();

                  let records = f.records;

                  let tb = "";
                  for(let k = 0; k < records.length; k++){
                      let n = records[k].name;
                      let i = records[k].id;
                      let l = records[k].location;
                      let tr = `<tr><td>`+records[k].name+`</td>`;
                      tr += `<td>`+records[k].location+`</td>`;
                      tr += `<td><a href="/editing-branch/?id=`+i+`&name=`+n+`&location=`+l+`">Edit</a> </td></tr>`;

                      tb += tr;
                  }
                  //console.log(records);

                  $("#the-branch").html(tb);
              },
              error: function (er) {
                  app.dialog.close();
              }
          });
      }

      if(page.name === "editing-branch"){
          updateAdmin();

          let p = page.route.query;
          let name = p.name;
          let location = p.location;
          let id = p.id;

          //console.log(name,location,id);

          $("#branch-name").val(name);
          $("#branch-location").val(location);



          $("body").off('submit', '#form-add-branch').on('submit', '#form-add-branch',function(e) {
              e.preventDefault();
              let name = $("#branch-name").val();
              let location = $("#branch-location").val();

              if (name == "" || location == "") {

                  app.toast.create({
                      text: 'All fields are required',
                      position: 'bottom',
                      closeTimeout: 3000
                  }).open();
                  //self.toastIcon.open();
                  vibration();

                  return false;
              }

              $("#loader").removeClass("hide");

              $.ajax({
                  url: url,
                  type: 'post',
                  dataType: 'json',
                  timeout: 45000,
                  data: {
                      'name': name,
                      'location': location,
                      'id': id,
                      'edit-branch': ''
                  },
                  success: function (f) {
                      $("#loader").addClass('hide');
                      if(f.ok == 0){
                          app.toast.create({
                              text: f.msg,
                              position: 'bottom',
                              closeTimeout: 3000
                          }).open();
                          //self.toastIcon.open();
                          vibration();
                      }else{
                          app.toast.create({
                              text: f.msg,
                              position: 'bottom',
                              closeTimeout: 3000
                          }).open();
                          //self.toastIcon.open();
                          vibration();
                          let stats = JSON.stringify(f.records);
                          sessionStorage.setItem("stats",stats);
                          //display_categories();
                      }
                  },
                  error: function (e) {
                      $("#loader").addClass('hide');
                      app.toast.create({
                          text: 'Network error, please try again!',
                          position: 'bottom',
                          closeTimeout: 3000
                      }).open();
                      //self.toastIcon.open();
                      vibration();
                  }
              });
          });
      }

      if(page.name === "all-branches"){
          updateAdmin();
          app.dialog.preloader('Fetching Branch');

          $.ajax({
              type: 'get',
              dataType: 'json',
              data: {
                  'load-branch': ''
              },
              url: url,
              timeout: 45000,
              success: function (f) {
                  app.dialog.close();

                  let records = f.records;

                  let tb = "";
                  for(let k = 0; k < records.length; k++){
                      let n = records[k].name;
                      let i = records[k].id;
                      let l = records[k].location;
                      let tr = `<tr><td>`+records[k].name+`</td>`;
                      tr += `<td>`+records[k].location+`</td>`;
                      tr += `<td><a href="/view-branch/?id=`+i+`&name=`+n+`&location=`+l+`">View</a> </td></tr>`;

                      tb += tr;
                  }
                  //console.log(records);

                  $("#the-branches").html(tb);
                  $("#export-branch").removeClass("disabled").removeAttr("disabled");
              },
              error: function (er) {
                  app.dialog.close();
              }
          });

          $("body").off('click', '#export-branch').on('click', '#export-branch',function(e) {
              let tmp_url = base_url+"/exports/all_branches.xls";
              window.open(tmp_url);

              //doit('xlsx', 'all-the-branches');
          });
      }


      //view-branch

      if(page.name === "view-branch"){
          updateAdmin();

          let p = page.route.query;
          let name = p.name;
          let location = p.location;
          let id = p.id;

          //console.log(name,location,id);

          $(".branch-name").html(name);
          $(".branch-location").html(location);


          app.dialog.progress("Fetching branch Information");

          $.ajax({
             url: url,
             dataType: 'json',
             type: 'get',
             data: {
                 'fetch_branch_info': '1',
                 'id' : id
             },
              timeout: 45000,
              success : function (f) {
                  app.dialog.close();

                  let product = f.stocks;
                  let users = f.users;
                  let staff = f.staff;

                  $(".branch-products").html(product.length);
                  $(".branch-staff").html(staff.length);


                  let tr = '';
                  for(let i = 0; i < users.length; i++){
                      tr += "<tr><td>"+users[i].name+"</td>";
                      tr += "<td>"+users[i].email+"</td>";
                      tr += "<td>"+users[i].phone+"</td>";
                      tr += "</tr>";
                  }

                  $("#branch-users").html(tr);



                  tr = '';
                  for(let i = 0; i < staff.length; i++){
                      tr += "<tr><td>"+staff[i].username+"</td>";
                      tr += "<td>"+staff[i].name+"</td>";
                      tr += "<td>"+staff[i].email+"</td>";
                      tr += "</tr>";
                  }

                  $("#the-branch-staff").html(tr);

                  tr = '';

                  for(let i = 0; i < product.length; i++){
                      let the_class = "bg-color-blue";
                      let the_qty = product[i].qty;
                      if(the_qty == 0){
                          the_class = "bg-color-red";
                      }else if(the_qty > 0 && the_qty < 10){
                          the_class = "bg-color-yellow";
                      }else{
                          the_class = "bg-color-green";
                      }
                      tr += "<tr class='"+the_class+"' style='color:#fff;'><td>"+product[i].name+"</td>";
                      tr += "<td>"+product[i].category+"</td>";
                      tr += "<td>&#8358; "+product[i].price+"</td>";
                      tr += "<td>"+product[i].qty+"</td>";
                      tr += "<td>"+product[i].date_updated+"</td>";
                      tr += "<td>"+product[i].last_user_name+"</td></tr>";
                  }

                  $("#the-branch-stock").html(tr);

                  $("#export-user, #export-stock, #export-staffs").removeClass("disabled").removeAttr("disabled");
              },
              error: function (e) {
                  app.dialog.close();
                  create_toast("Network error!, go back and try again!");
              }
          });

          $("body").off('click', '#export-staffs').on('click', '#export-staffs',function(e) {
              let tmp_url = base_url+"/exports/branch_staff.php?id="+id;
              window.open(tmp_url);

              //doit('xlsx', 'staff-table');
          });

          $("body").off('click', '#export-stock').on('click', '#export-stock',function(e) {
              //let tmp_url = base_url+"/exports/all_branches.pdf";
              //window.open(tmp_url);

              let tmp_url = base_url+"/exports/branch_stock.php?id="+id;
              window.open(tmp_url);
          });

          $("body").off('click', '#export-user').on('click', '#export-user',function(e) {
              //let tmp_url = base_url+"/exports/all_branches.pdf";
              //window.open(tmp_url);

              let tmp_url = base_url+"/exports/branch_user.php?id="+id;
              window.open(tmp_url);
          });

      }


      if(page.name === "add-staff"){
          updateAdmin();

          app.dialog.progress("Fetching branches");

          $.ajax({
             url: url,
             type: 'get',
             dataType: 'json',
             data: {
                 'fetch_branch': '1'
             },
              timeout: 45000,
              error: function (e) {
                  app.dialog.close();
                  create_toast("Network error, please go back and try again!");
              },
              success: function (f) {
                  //staff-branch
                  app.dialog.close();
                  let records = f.branches;

                  let sel = "";
                  for(let i = 0; i < records.length; i++){
                      sel += "<option value='"+records[i].id+"'>"+records[i].name+" ,"+records[i].location+"</option>";
                  }

                  $("#staff-branch").html(sel);
              }
          });

          $("body").off('submit', '#form-add-staff').on('submit', '#form-add-staff',function(e) {
              e.preventDefault();
              let name = $("#staff-name").val();
              let username = $("#staff-username").val();
              let email = $("#staff-email").val();
              let branch_id = $("#staff-branch").val();
              let password = $("#staff-password").val();

              if (name == "" || username == "" || email == "" || branch_id == "" || password == "") {

                  app.toast.create({
                      text: 'All fields are required',
                      position: 'bottom',
                      closeTimeout: 3000
                  }).open();
                  //self.toastIcon.open();
                  vibration();

                  return false;
              }

              $("#loader").removeClass("hide");

              $.ajax({
                  url: url,
                  type: 'post',
                  dataType: 'json',
                  timeout: 45000,
                  data: {
                      'name': name,
                      'username': username,
                      'email': email,
                      'password': password,
                      'branch_id': branch_id,
                      'add-staff': ''
                  },
                  success: function (f) {
                      $("#loader").addClass('hide');
                      if(f.ok == 0){
                          app.toast.create({
                              text: f.msg,
                              position: 'bottom',
                              closeTimeout: 3000
                          }).open();
                          //self.toastIcon.open();
                          vibration();
                      }else{
                          $("#staff-name, #staff-password, #staff-email, #staff-username").val('');
                          app.toast.create({
                              text: f.msg,
                              position: 'bottom',
                              closeTimeout: 3000
                          }).open();
                          //self.toastIcon.open();
                          vibration();
                          let stats = JSON.stringify(f.records);
                          sessionStorage.setItem("stats",stats);
                          //display_categories();
                      }
                  },
                  error: function (e) {
                      $("#loader").addClass('hide');
                      app.toast.create({
                          text: 'Network error, please try again!',
                          position: 'bottom',
                          closeTimeout: 3000
                      }).open();
                      //self.toastIcon.open();
                      vibration();
                  }
              });
          });
      }





      if(page.name === "edit-staff"){
          updateAdmin();
          app.dialog.preloader('Fetching Staff');

          $.ajax({
              type: 'get',
              dataType: 'json',
              data: {
                  'load-staff': ''
              },
              url: url,
              timeout: 45000,
              success: function (f) {
                  app.dialog.close();

                  let records = f.records;

                  let tb = "";
                  for(let k = 0; k < records.length; k++){
                      let n = records[k].name;
                      let i = records[k].id;
                      let l = records[k].branch_id;
                      let bn = records[k].branch_name + " "+ records[k].location;
                      let u = records[k].username;
                      let e = records[k].email;
                      let tr = `<tr><td>`+records[k].name+`</td>`;
                      tr += `<td>`+records[k].username+`</td>`;
                      tr += `<td>`+bn+`</td>`;
                      tr += `<td><a href="/editing-staff/?id=`+i+`&name=`+n+`&branch_id=`+l+`&username=`+u+`&email=`+e+`">Edit</a> </td></tr>`;

                      tb += tr;
                  }
                  //console.log(records);

                  $("#the-staff-b").html(tb);
              },
              error: function (er) {
                  app.dialog.close();
              }
          });
      }

      if(page.name === "editing-staff"){
          updateAdmin();

          let p = page.route.query;
          let name = p.name;
          let branch = p.branch_id;
          let email = p.email;
          let username = p.username;
          let id = p.id;


          $("#staff-name").val(name);
          $("#staff-username").val(username);
          $("#staff-email").val(email);


          app.dialog.progress("Fetching branches");

          $.ajax({
              url: url,
              type: 'get',
              dataType: 'json',
              data: {
                  'fetch_branch': '1'
              },
              timeout: 45000,
              error: function (e) {
                  app.dialog.close();
                  create_toast("Network error, please go back and try again!");
              },
              success: function (f) {
                  //staff-branch
                  app.dialog.close();
                  let records = f.branches;

                  let sel = "";
                  for(let i = 0; i < records.length; i++){
                      sel += "<option value='"+records[i].id+"'>"+records[i].name+" ,"+records[i].location+"</option>";
                  }

                  $("#staff-branch").html(sel);
                  $("#staff-branch").val(branch);
              }


          });

          $("body").off('submit', '#form-add-staff').on('submit', '#form-add-staff',function(e) {
              e.preventDefault();
              let name = $("#staff-name").val();
              let username = $("#staff-username").val();
              let email = $("#staff-email").val();
              let branch_id = $("#staff-branch").val();


              if (name == "" || username == "" || email == "" || branch_id == "") {

                  app.toast.create({
                      text: 'All fields are required',
                      position: 'bottom',
                      closeTimeout: 3000
                  }).open();
                  //self.toastIcon.open();
                  vibration();

                  return false;
              }

              $("#loader").removeClass("hide");

              $.ajax({
                  url: url,
                  type: 'post',
                  dataType: 'json',
                  timeout: 45000,
                  data: {
                      'name': name,
                      'username': username,
                      'email': email,
                      'branch_id': branch_id,
                      'id': id,
                      'edit-staff': ''
                  },
                  success: function (f) {
                      $("#loader").addClass('hide');
                      if(f.ok == 0){
                          app.toast.create({
                              text: f.msg,
                              position: 'bottom',
                              closeTimeout: 3000
                          }).open();
                          //self.toastIcon.open();
                          vibration();
                      }else{
                          //$("#staff-name, #staff-email, #staff-username").val('');
                          app.toast.create({
                              text: f.msg,
                              position: 'bottom',
                              closeTimeout: 3000
                          }).open();
                          //self.toastIcon.open();
                          vibration();
                          let stats = JSON.stringify(f.records);
                          sessionStorage.setItem("stats",stats);
                          //display_categories();
                      }
                  },
                  error: function (e) {
                      $("#loader").addClass('hide');
                      app.toast.create({
                          text: 'Network error, please try again!',
                          position: 'bottom',
                          closeTimeout: 3000
                      }).open();
                      //self.toastIcon.open();
                      vibration();
                  }
              });
          });

          //console.log(name,location,id);





          /*$("body").off('submit', '#form-add-branch').on('submit', '#form-add-branch',function(e) {
              e.preventDefault();
              let name = $("#branch-name").val();
              let location = $("#branch-location").val();

              if (name == "" || location == "") {

                  app.toast.create({
                      text: 'All fields are required',
                      position: 'bottom',
                      closeTimeout: 3000
                  }).open();
                  //self.toastIcon.open();
                  vibration();

                  return false;
              }

              $("#loader").removeClass("hide");

              $.ajax({
                  url: url,
                  type: 'post',
                  dataType: 'json',
                  timeout: 45000,
                  data: {
                      'name': name,
                      'location': location,
                      'id': id,
                      'edit-branch': ''
                  },
                  success: function (f) {
                      $("#loader").addClass('hide');
                      if(f.ok == 0){
                          app.toast.create({
                              text: f.msg,
                              position: 'bottom',
                              closeTimeout: 3000
                          }).open();
                          //self.toastIcon.open();
                          vibration();
                      }else{
                          app.toast.create({
                              text: f.msg,
                              position: 'bottom',
                              closeTimeout: 3000
                          }).open();
                          //self.toastIcon.open();
                          vibration();
                          let stats = JSON.stringify(f.records);
                          sessionStorage.setItem("stats",stats);
                          //display_categories();
                      }
                  },
                  error: function (e) {
                      $("#loader").addClass('hide');
                      app.toast.create({
                          text: 'Network error, please try again!',
                          position: 'bottom',
                          closeTimeout: 3000
                      }).open();
                      //self.toastIcon.open();
                      vibration();
                  }
              });
          });*/
      }

      if(page.name === "all-staff"){


          updateAdmin();
          app.dialog.preloader('Fetching Staff');

          $.ajax({
              type: 'get',
              dataType: 'json',
              data: {
                  'load-staff': ''
              },
              url: url,
              timeout: 45000,
              success: function (f) {
                  app.dialog.close();

                  let records = f.records;

                  let tb = "";
                  for(let k = 0; k < records.length; k++){
                      let n = records[k].name;
                      let i = records[k].id;
                      let l = records[k].branch_id;
                      let bn = records[k].branch_name + " "+ records[k].location;
                      let u = records[k].username;
                      let e = records[k].email;
                      let tr = `<tr><td>`+records[k].name+`</td>`;
                      tr += `<td>`+records[k].username+`</td>`;
                      tr += `<td>`+e+`</td>`;
                      tr += `<td>`+bn+`</td>`;
                      tr += `</tr>`;

                      tb += tr;
                  }
                  //console.log(records);

                  $("#the-staff-v").html(tb);
                  $("#export-staff").removeClass("disabled").removeAttr("disabled");
              },
              error: function (er) {
                  app.dialog.close();
              }
          });

          $("body").off('click', '#export-staff').on('click', '#export-staff',function(e) {
              //let tmp_url = base_url+"/exports/all_branches.pdf";
              //window.open(tmp_url);

              let tmp_url = base_url+"/exports/all_staff.xls";
              window.open(tmp_url);

              //doit('xlsx', 'all-the-staff');
          });
      }

      if(page.name === "new-category"){
          updateManager();
          display_categories();
          $("body").off('submit', '#form-add-cat').on('submit', '#form-add-cat',function(e) {
              e.preventDefault();
              let category = $("#category-name").val();

              if (category == "") {

                  app.toast.create({
                      text: 'Enter category name',
                      position: 'bottom',
                      closeTimeout: 3000
                  }).open();
                  //self.toastIcon.open();
                  vibration();

                  return false;
              }

              $("#loader").removeClass("hide");

              $.ajax({
                 url: url,
                 type: 'post',
                 dataType: 'json',
                 timeout: 45000,
                 data: {
                     'branch_id': sessionStorage.getItem("branch_id"),
                     'category': category,
                     'add-category': ''
                 },
                  success: function (f) {
                     $("#loader").addClass('hide');
                      if(f.ok == 0){
                          app.toast.create({
                              text: f.msg,
                              position: 'bottom',
                              closeTimeout: 3000
                          }).open();
                          //self.toastIcon.open();
                          vibration();
                      }else{
                          $("#category-name").val('');
                          app.toast.create({
                              text: f.msg,
                              position: 'bottom',
                              closeTimeout: 3000
                          }).open();
                          //self.toastIcon.open();
                          vibration();
                          let category = JSON.stringify(f.category);
                          sessionStorage.setItem("category",category);
                          sessionStorage.setItem("total_category", f.total_cats);

                          display_categories();
                      }
                  },
                  error: function (e) {
                      $("#loader").addClass('hide');
                      app.toast.create({
                          text: 'Network error, please try again!',
                          position: 'bottom',
                          closeTimeout: 3000
                      }).open();
                      //self.toastIcon.open();
                      vibration();
                  }
              });
          });
      }


      if(page.name === "view-category"){
          updateManager();

          let categories = JSON.parse(sessionStorage.getItem("category"));

          let tr = '';
          for(let i = 0; i < categories.length; i++){
              tr += "<tr><td>"+categories[i].category+"</td>";
              tr += "<td><a href='/edit-category/?name="+categories[i].category+"&id="+categories[i].id+"'>Edit</a></td></tr>";
          }

          $("#the-cats").html(tr);
      }

      if(page.name === "all-category"){
          updateCustomer();

          let categories = JSON.parse(sessionStorage.getItem("category"));

          let tr = '';
          for(let i = 0; i < categories.length; i++){
              tr += "<tr><td>"+categories[i].category+"</td>";
              tr += "<td><a href='/the-products/?name="+categories[i].category+"&id="+categories[i].id+"'>View</a></td></tr>";
          }

          $("#the-cats").html(tr);
      }

      if(page.name === "the-products") {
          updateCustomer();

          let p = page.route.query;
          let cat_id = p.id;
          let cat_name = p.name;
          $("#the-title").html(cat_name);


          let stocks = JSON.parse(sessionStorage.getItem("store_stocks"));

          let div = '';
          for(let j = 0; j < stocks.length; j++){
              let cats = stocks[j].cat_id;
              if(cats != cat_id){
                  continue;
              }
              let prod_id = stocks[j].id;
              let prod_name = stocks[j].name;
              let price = stocks[j].price;
              let qty = stocks[j].qty;
              let prod_desc = stocks[j].prod_desc;
              let cat = stocks[j].category;
              let image = stocks[j].image;

              let img = getImage(image,70);
              div += '<li><a href="#" class="item-link item-content">';
              div += '<div class="item-media"><img src="'+img+'" width="70"/></div>';
              div += '<div class="item-inner"><div class="item-title-row"><div class="item-title">';
              div += prod_name;
              div += '</div><div class="item-after">&#8358; '+price+' </div>';
              div += '</div><div class="item-subtitle">'+cat+'</div>';
              div += '<div class="item-text">'+prod_desc+'</div></div></a></li>';
          }


          $("#the-products").html(div);
      }

      if(page.name === "profile"){
          updateCustomer();
          $("#fname").html(sessionStorage.getItem("name"));
          $("#emaila").html(sessionStorage.getItem("email"));
          $("#phone").html(sessionStorage.getItem("phone"));
      }


       if(page.name === "edit-category"){
          updateManager();

          let p = page.route.query;
          let cat_id = p.id;
          let cat_name = p.name;

          $("#category-name").val(cat_name);


          $("body").off('submit', '#form-edit-cat').on('submit', '#form-edit-cat',function(e) {
              e.preventDefault();
              let category = $("#category-name").val();

              if (category == "") {

                  app.toast.create({
                      text: 'Enter category name',
                      position: 'bottom',
                      closeTimeout: 3000
                  }).open();
                  //self.toastIcon.open();
                  vibration();

                  return false;
              }

              $("#loader").removeClass("hide");

              $.ajax({
                  url: url,
                  type: 'post',
                  dataType: 'json',
                  timeout: 45000,
                  data: {
                      'branch_id': sessionStorage.getItem("branch_id"),
                      'category': category,
                      'cat_id': cat_id,
                      'edit-category': ''
                  },
                  success: function (f) {
                      $("#loader").addClass('hide');
                      if(f.ok == 0){
                          app.toast.create({
                              text: f.msg,
                              position: 'bottom',
                              closeTimeout: 3000
                          }).open();
                          //self.toastIcon.open();
                          vibration();
                      }else{

                          app.toast.create({
                              text: f.msg,
                              position: 'bottom',
                              closeTimeout: 3000
                          }).open();
                          //self.toastIcon.open();
                          vibration();
                          let category = JSON.stringify(f.category);
                          sessionStorage.setItem("category",category);
                          sessionStorage.setItem("total_category", f.total_cats);
                      }
                  },
                  error: function (e) {
                      $("#loader").addClass('hide');
                      app.toast.create({
                          text: 'Network error, please try again!',
                          position: 'bottom',
                          closeTimeout: 3000
                      }).open();
                      //self.toastIcon.open();
                      vibration();
                  }
              });
          });
      }


      if(page.name === "view-products" || page.name === "update-stock"){
          updateManager();

          let stocks = JSON.parse(sessionStorage.getItem("store_stocks"));

          let div = '';
          for(let j = 0; j < stocks.length; j++){
              let prod_id = stocks[j].id;
              let prod_name = stocks[j].name;
              let price = stocks[j].price;
              let qty = stocks[j].qty;
              let prod_desc = stocks[j].prod_desc;
              let cat = stocks[j].category;
              let cats = stocks[j].cat_id;
              let image = stocks[j].image;

              let img = getImage(image,70);
              div += '<li><a href="/edit-product/?id='+prod_id+'&name='+prod_name+'&price='+price+'&qty='+qty+'&prod_desc='+prod_desc+'&cat='+cats+'" class="item-link item-content">';
              div += '<div class="item-media"><img src="'+img+'" width="70"/></div>';
              div += '<div class="item-inner"><div class="item-title-row"><div class="item-title">';
              div += prod_name;
              div += '</div><div class="item-after">&#8358; '+price+' </div>';
              div += '</div><div class="item-subtitle">'+cat+'</div>';
              div += '<div class="item-text">'+prod_desc+'</div></div></a></li>';
          }


          $("#the-products").html(div);


      }


      if(page.name === "all-products"){
          updateCustomer();

          let stocks = JSON.parse(sessionStorage.getItem("store_stocks"));

          let div = '';
          for(let j = 0; j < stocks.length; j++){
              let prod_id = stocks[j].id;
              let prod_name = stocks[j].name;
              let price = stocks[j].price;
              let qty = stocks[j].qty;
              let prod_desc = stocks[j].prod_desc;
              let cat = stocks[j].category;
              let cats = stocks[j].cat_id;
              let image = stocks[j].image;

              let img = getImage(image,70);
              div += '<li><a href="#" class="item-link item-content">';
              div += '<div class="item-media"><img src="'+img+'" width="70"/></div>';
              div += '<div class="item-inner"><div class="item-title-row"><div class="item-title">';
              div += prod_name;
              div += '</div><div class="item-after">&#8358; '+price+' </div>';
              div += '</div><div class="item-subtitle">'+cat+'</div>';
              div += '<div class="item-text">'+prod_desc+'</div></div></a></li>';
          }


          $("#the-products").html(div);


      }

      //edit product

      if(page.name === "edit-product"){
          updateManager();

          let p = page.route.query;
          $("#prod-name-edit").val(p.name);
          $("#prod-price-edit").val(p.price);
          $("#prod-desc-edit").val(p.prod_desc);
          $("#prod-qty-edit").val(p.qty);


          let the_cats = JSON.parse(sessionStorage.getItem("category"));

          let the_select = '';
          for(let j = 0; j < the_cats.length; j++){
              the_select += "<option value='"+the_cats[j].id+"'>"+the_cats[j].category+"</option>"
          }

          $("#prod-cats-edit").html(the_select);

          $("#prod-cats-edit").val(p.cat);



          $("body").off("submit","#form-edit-prod").on("submit","#form-edit-prod", function (e) {
              e.preventDefault();
              let name = $("#prod-name-edit").val();
              let category = $("#prod-cats-edit").val();
              let price = $("#prod-price-edit").val();
              let qty = $("#prod-qty-edit").val();
              let prod_desc = $("#prod-desc-edit").val();



              if(name == "" || category == "" || price == "" || qty == "" || prod_desc == ""){
                  create_toast("Kindly fill all fields!");
                  vibration();
                  return;
              }

              $("#loader").removeClass("hide");
              $.ajax({
                  url: url,
                  type: 'post',
                  dataType: 'json',
                  timeout: 45000,
                  data: {
                      'update_product': '',
                      'name': name,
                      'category': category,
                      'price': price,
                      'qty': qty,
                      'prod_desc': prod_desc,
                      'branch_id': sessionStorage.getItem("branch_id"),
                      'user_id': sessionStorage.getItem("user_id"),
                      'id': p.id
                  },
                  error: function (er) {
                      create_toast("Network error, please try again!");
                      vibration();
                  },
                  success: function (f) {
                      let stocks = JSON.stringify(f.stocks);
                      let total_stocks = f.total_stocks;

                      sessionStorage.setItem("store_stocks",stocks);
                      sessionStorage.setItem("total_stocks", total_stocks);

                      create_toast(f.msg);
                      vibration();
                      $("#loader").addClass('hide');
                  }
              });
          });

      }
      if(page.name === "view-users"){
          updateManager();
          let users = JSON.parse(sessionStorage.getItem("store_users"));

          let tr = '';
          for(let i = 0; i < users.length; i++){
              tr += "<tr><td>"+users[i].name+"</td>";
              tr += "<td>"+users[i].email+"</td>";
              tr += "<td>"+users[i].phone+"</td>";
              tr += "</tr>";
          }

          $("#the-users").html(tr);
      }

      if(page.name === "new-user"){
          updateManager();
          $("#the-branch").val(sessionStorage.getItem("branch_id"));
          $("body").off('submit', '#form-add-user').on('submit', '#form-add-user',function(e) {
              e.preventDefault();

              var formData = $("#form-add-user").serialize();
              $("#loader").removeClass("hide");

              $.ajax({
                  url: url,
                  type: 'post',
                  dataType: 'json',
                  timeout: 45000,
                  data: formData,
                  success: function (f) {
                      $("#loader").addClass('hide');
                      if(f.ok == 0){
                          app.toast.create({
                              text: f.msg,
                              position: 'bottom',
                              closeTimeout: 3000
                          }).open();
                          //self.toastIcon.open();
                          vibration();
                      }else{
                          $("#user-name, #user-email, #user-phone").val('');
                          app.toast.create({
                              text: f.msg,
                              position: 'bottom',
                              closeTimeout: 3000
                          }).open();
                          //self.toastIcon.open();
                          vibration();
                          let users = JSON.stringify(f.category);
                          sessionStorage.setItem("store_users",users);
                          sessionStorage.setItem("total_users", f.total_cats);
                      }
                  },
                  error: function (e) {
                      $("#loader").addClass('hide');
                      app.toast.create({
                          text: 'Network error, please try again!',
                          position: 'bottom',
                          closeTimeout: 3000
                      }).open();
                      //self.toastIcon.open();
                      vibration();
                  }
              });
          });
      }



      if(page.name === "add-product"){
          updateManager();
          let the_cats = JSON.parse(sessionStorage.getItem("category"));

          let the_select = '';
          for(let j = 0; j < the_cats.length; j++){
              the_select += "<option value='"+the_cats[j].id+"'>"+the_cats[j].category+"</option>"
          }

          $("#prod-cats").html(the_select);



          $("body").off("submit","#form-add-prod").on("submit","#form-add-prod", function (e) {
              e.preventDefault();
              let name = $("#prod-name").val();
              let category = $("#prod-cats").val();
              let price = $("#prod-price").val();
              let image = $("#the-image").val();
              let qty = $("#prod-qty").val();
              let prod_desc = $("#prod-desc").val();


              if(image == ""){
                  create_toast("Kindly upload product image!");
                  vibration();
                  return;
              }

              if(name == "" || category == "" || price == "" || qty == "" || prod_desc == ""){
                  create_toast("Kindly fill all fields!");
                  vibration();
                  return;
              }

              $("#loader").removeClass("hide");
              $.ajax({
                 url: url,
                 type: 'post',
                 dataType: 'json',
                 timeout: 45000,
                  data: {
                     'add_product': '',
                      'name': name,
                      'category': category,
                      'price': price,
                      'image': image,
                      'qty': qty,
                      'prod_desc': prod_desc,
                      'branch_id': sessionStorage.getItem("branch_id"),
                      'user_id': sessionStorage.getItem("user_id")
                  },
                  error: function (er) {
                      create_toast("Network error, please try again!");
                      vibration();
                  },
                  success: function (f) {
                      let stocks = JSON.stringify(f.stocks);
                      let total_stocks = f.total_stocks;

                      sessionStorage.setItem("store_stocks",stocks);
                      sessionStorage.setItem("total_stocks", total_stocks);

                      create_toast(f.msg);
                      vibration();
                      $("#the-image, #prod-name, #prod-price, #prod-qty, #prod-desc").val('');
                      $("#uploaded").attr("src","");

                      $("#loader").addClass('hide');
                  }
              });
          });
          /*
          FILE UPLOAD
           */

          const uploadButton = document.querySelector('.browse-btn');
          const fileInfo = document.querySelector('.file-info');
          const realInput = document.getElementById('real-input');
          uploadButton.addEventListener('click', () => {
              console.log("Clicked...");
              realInput.click();
          });


          realInput.addEventListener('change', () => {
              const name = realInput.value.split(/\\|\//).pop();
              const truncated = name.length > 20
                  ? name.substr(name.length - 20)
                  : name;

              //fileInfo.innerHTML = truncated;
          });
          window.ajaxSuccess = function () {
              response = JSON.parse(this.responseText);
              console.log("ajaxSuccess", typeof this.responseText);
              document.getElementById('uploaded').setAttribute("src", response["secure_url"]);
              document.getElementById("the-image").value = response["secure_url"];
              create_toast("Image uploaded successfully...");
              //document.getElementById('results').innerText = this.responseText;
          }

          window.ajaxError = function(){
              create_toast("Unable to upload image...");
              vibration();
          }

          window.AJAXSubmit = function (formElement) {

              create_toast("Starting image upload...");
              if (!formElement.action) {return; }
              var xhr = new XMLHttpRequest();
              xhr.onload = ajaxSuccess;
              xhr.onerror = ajaxError;
              xhr.open("post", "https://api.cloudinary.com/v1_1/onlinemedia234/image/upload");
              xhr.send(new FormData(formElement));
          }

          /*

           */
      }

        if(page.name === "home"){
	  	    var user_id = sessionStorage.getItem("user_id");
	  	    if(user_id == "" || user_id == null){
	  	        window.location = "index.html";
	  	        return;
            }

            var mName = sessionStorage.getItem("name");
	  	    $(".log-name").html(mName);

	  	    $("body").off("click",".logout").on("click",".logout", function (e) {
               app.dialog.confirm("Are you sure you want to logout?","Logout",function (e) {
                  sessionStorage.clear();
                  window.location = "index.html";
               });
            });
        }

        if(page.name === "create"){
	  	    isLogin();

	  	    var categories = sessionStorage.getItem("category");
	  	    categories = JSON.parse(categories);
	  	    var t = "";
	  	    for(var i = 0; i < categories.length; i++){
	  	        t += "<option>"+categories[i].category+"</option>";
            }

            $("#item-category").html(t);
	  	    var t = "";

	  	    for(var j = 1; j <= 24; j++){
	  	        t += "<option value='"+j+"'>"+j+" Hours</option>";
            }

            t += "<option value='48'>2 Days</option>";
            t += "<option value='72'>3 Days</option>";
            $("#item-hours").html(t);
            var manualUploader = new qq.FineUploader({
                element: document.getElementById('fine-uploader-manual-trigger'),
                template: 'qq-template-manual-trigger',
                request: {
                    endpoint: server_upload_url + 'upload.php',
                    params: {
                        'project': 'Auction',
                        'folder': 'products'
                    }
                },
                thumbnails: {
                    placeholders: {
                        waitingPath: 'lib/upload/waiting-generic.png',
                        notAvailablePath: 'lib/upload/not_available-generic.png'
                    }
                },
                validation: {
                    allowedExtensions: ['jpeg', 'jpg', 'png'],
                    itemLimit: 5,
                    sizeLimit: 2097152 // 50 kB = 50 * 1024 bytes
                },
                autoUpload: true,
                debug: false,
                callbacks: {
                    onComplete: function(id, name, responseJSON, xhr) {
                        var image_name = (responseJSON.image_name);
                        $("[name=image]").val($("[name=image]").val()+"\n"+image_name);
                        //console.log(responseJSON);
                        //manualUploader.reset();
                    }
                }
            });

            qq(document.getElementById("trigger-upload")).attach("click", function() {
                manualUploader.uploadStoredFiles();
            });


            $("body").off("click",".finish-sub").on("click",".finish-sub", function (e) {
               e.preventDefault();
               var title = $("#item-name").val();
               var category = $("#item-category").val();
               var amount = $("#item-amount").val();
               var item_desc = $("#item-desc").val();
               var item_date = $("#item-date").val();
               var item_time = $("#item-time").val();
               var item_hours = $("#item-hours").val();
               var image = $("#item-image").val();

               if(image == ""){
                   create_toast("Kindly upload item image");
                   return;
               }

               if(title == "" || category == "" || amount == "" || item_desc == "" || item_date == "" || item_time == "" || item_hours == ""){
                   create_toast("All fields are required");
                   return;
               }

               app.dialog.progress("Processing");

               $.ajax({
                  url: url,
                  type: 'post',
                  dataType: 'json',
                  timeout: 30000,
                  data: {
                      'submit-auction': '',
                      'user_id': sessionStorage.getItem("user_id"),
                      'title': title,
                      'item_desc': item_desc,
                      'amount': amount,
                      'image': image,
                      'item_date': item_date,
                      'item_time': item_time,
                      'item_hours': item_hours,
                      'category': category
                  },
                   error: function (er) {
                      app.dialog.close();
                       create_toast("Network error, please try again!");
                   },
                   success: function (f) {
                       var total = f.total;
                       app.dialog.close();
                       if(total == 1){
                           var my_auctions = JSON.stringify(f.my_auctions);
                           sessionStorage.setItem("my_auctions", my_auctions);
                           $("#item-name, #item-hours, #item-date, #item-image, #item-time, #item-desc, #item-category").val('');
                           manualUploader.reset();
                           create_toast("Item submitted for auction successfully");
                       }else{
                           create_toast(f.msg);
                       }
                   }
               });
            });

        }

        if(page.name === "category"){
	  	    isLogin();

	  	    var cats = JSON.parse(sessionStorage.getItem("category"));
	  	    var t = "";
	  	    for(let i = 0; i < cats.length; i++){
	  	        t += "<li><a href='/auction-cat/?category="+cats[i].category+"'>"+cats[i].category+"</a></li>";
            }

            $("#cat-list").html(t);
        }

        if(page.name === "cat"){
	  	    isLogin();

	  	    var p = page.route.query;
	  	    var pname = p.category;
	  	    $(".pname").html(pname);

            app.preloader.show();

            $.ajax({
                url: url,
                type: 'get',
                dataType: 'json',
                data: {
                    'load-auctions-cat': '',
                    'user_id': sessionStorage.getItem("user_id"),
                    'category': pname
                },
                timeout: 30000,
                error: function (er) {
                    app.preloader.hide();
                    create_toast("Network error...");
                },
                success: function (f) {
                    app.preloader.hide();
                    var total = f.total;
                    if(total == 0){
                        $(".no-items").show();
                    }else{
                        var data = f.auctions;
                        parseAuctions(data,"#cat-lists");
                    }
                }
            });
        }

        if(page.name === "auctions"){
	  	    isLogin();

	  	    app.preloader.show();

	  	    $.ajax({
               url: url,
               type: 'get',
               dataType: 'json',
               data: {
                   'load-auctions': '',
                   'user_id': sessionStorage.getItem("user_id")
               },
                timeout: 30000,
                error: function (er) {
                    app.preloader.hide();
                    create_toast("Network error...");
                },
                success: function (f) {
                    app.preloader.hide();
                    var total = f.total;
                    if(total == 0){
                        $(".no-item").show();
                    }else{
                        var data = f.auctions;
                        parseAuctions(data,".all-auctions");
                    }
                }
            });
        }

        if(page.name === "view"){
	  	    isLogin();

            var p = page.route.query;
            var p_id = p.id;

            $(".res-img").html('');
            create_toast("Fetching auction item images...");

            $.ajax({
               url: url,
               type: 'get',
               dataType: 'json',
               data: {
                   'load_item_img': '',
                   'id': p_id
               },
                timeout: 45000,
                success: function (f) {
                    var imgs = f.imgs;
                   for(var kk = 0; kk < imgs.length; kk++){
                        var img = server_upload_url + "/" + app_path + "/products/"+imgs[kk];
                        var l = '<a href="" class="popup-open btn-order" data-popup=".demo-popup" data-img="'+img+'">';
                        l += '<img src="'+img+'" width="100" height="100" class="book-img"></a>';

                        $(".res-img").append(l);
                    }
                }
            });

            $("body").off("click",".popup-open").on("click",".popup-open", function(e){
                $(".img-to-view").attr("src","");
                var attr = $(this).data("img");
                //console.log(attr);
                $(".img-to-view").attr("src",attr);
            });

            var amt = parseInt(p.amount);
            $(".ptitle").html(p.title);
            $(".bg-img").css("background-image","url("+p.image+")");
            $(".item-desc").html(p.item_desc);
            $(".item-price").html(p.price);
            $(".item-category").html(p.category);

            if(p.highest == "null"){
                $(".highest").html("&#8358; 0");
                var highest_bid = 0;
            }else{
                $(".highest").html("&#8358; "+p.highest);
                var highest_bid = parseInt(p.highest);
            }

            if(p.my_bid == "null"){
                $(".my_bid").html("&#8358; 0");
            }else{
                $(".my_bid").html("&#8358; "+p.my_bid);

                //$(".submit-bids").hide();
            }

            $(".end-date").html(p.end_date);


            $("body").off("click",".btn-bid").on("click",".btn-bid",function (e) {
               e.preventDefault();

               var bid_amt = $("#bid-amt").val();

               if(bid_amt == ""){
                   create_toast("Enter a bid amount!");
                   return;
               }

               if(isNaN(bid_amt)){
                   create_toast("Only numbers are allowed");
                   return;
               }

               bid_amt = parseInt(bid_amt);

               if(bid_amt < amt){
                   create_toast("Bid amount must not be less than base amount");
                   return;
               }

               if(bid_amt <= highest_bid){
                   create_toast("Your bid must be more than the highest bid!");
                   return;
               }

               app.dialog.progress("Submitting bid, please wait...");
               $.ajax({
                  url: url,
                  type: 'post',
                  timeout: 30000,
                  error: function (er) {
                      app.dialog.close();
                      create_toast("Network error, please try again!");
                  },
                   data: {
                      'submit-bid': '',
                       'user_id': sessionStorage.getItem("user_id"),
                       'amount': bid_amt,
                       'auction_id': p.id
                   },
                   success: function (f) {
                       app.dialog.close();
                       amt = bid_amt;
                       highest_bid = bid_amt;

                       $(".highest").html("&#8358; "+highest_bid);
                       $(".my_bid").html("&#8358; "+highest_bid);
                       $("#bid-amt").val('');
                       create_toast("Bid submitted successfully");
                   }
               });



            });


        }




	    // Code for Services page
    
	});

    $$(document).on('page:reinit', function (e) {
        var page = e.detail;
        //console.log("we are here...");

        if(page.name === "admin-home"){
            let records = sessionStorage.getItem("stats");
            let records_json = JSON.parse(records);
            $(".total-categories").html(records_json.categories);
            $(".total-items").html(records_json.stocks);
            $(".total-users").html(records_json.users);
            $(".total-staff").html(records_json.staff);
            $(".total-branch").html(records_json.branches);
            $(".total-in_stock").html(records_json.in_stock);
            $(".total-out_stock").html(records_json.out_of_stock);
            $(".total-almost-out").html(records_json.almost_out);
        }
    });


function isLogin() {
    var user_id = sessionStorage.getItem("user_id");
    if(user_id == "" || user_id == null){
        window.location = "index.html";
        return;
    }
}


function parseAuctions(data,container) {
    
    var htmls = "";

    for(var i = 0; i < data.length; i++){
        var img = server_upload_url+""+app_path+"products/thumb/"+data[i].image;
        var pimg = server_upload_url+""+app_path+"products/"+data[i].image;
        var title = data[i].title;
        var item_desc = data[i].item_desc;
        var category = data[i].category;
        var amount = data[i].amount;
        var price = data[i].price;
        var end_date = data[i].end_date;
        var my_bid = data[i].bid;
        var highest = data[i].highest;
        var id = data[i].id;
        htmls += '<li>';
        htmls += '<a href="/view/?title='+title+'&item_desc='+item_desc+'&category='+category+'&price='+price+'&image='+pimg+'&id='+id+'&amount='+amount+'&end_date='+end_date+'&my_bid='+my_bid+'&highest='+highest+'" class="item-link item-content">';
        htmls += '<div class="item-media data-img-li">';
        htmls += '<img src="'+img+'" class="img-responsive img-circle" width="70">';
        htmls += '</div>';
        htmls += '<div class="item-inner">';
        htmls += '<div class="item-title">'
        htmls += '<div class="item-header">'+category+'</div>';
        htmls += title+'</div>';
        htmls += '<div class="item-after">'+price+'</div>';
        htmls += '<div class="item-footer">End At: '+end_date+'</div>';
        htmls += '</div></div></a></li>';
    }

    $(container).html(htmls);
    //console.log(htmls);

    
}