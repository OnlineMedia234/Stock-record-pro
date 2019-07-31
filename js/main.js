

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
    if(sessionStorage.getItem("branch_id") == "" || sessionStorage.getItem("branch_id") == null){
        window.location = "index.html";
    }
      $(".manager-name").html(sessionStorage.getItem("name"));
      $(".branch-name").html(sessionStorage.getItem("branch"));
  }


  function getImage(image,width, h=width){
      let img = image.split("/");
      img = img[8];
      img = "https://res.cloudinary.com/onlinemedia234/image/upload/w_"+width+",h_"+h+",c_fill/stock/"+img;

      return img;
  }





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

        if(page.name === "profile"){
	  	    isLogin();
	  	    $("#reg-phone").val(sessionStorage.getItem("phone"));
	  	    $("#reg-name").val(sessionStorage.getItem("name"));
	  	    $("#reg-username").val(sessionStorage.getItem("username"));
	  	    $("#reg-email").val(sessionStorage.getItem("email"));

	  	    $(".pname").html(sessionStorage.getItem("name"));
            $("#updateProfile").on("click",function(e){
                e.preventDefault();
                var names = $("#reg-name").val();
                var phone = $("#reg-phone").val();
                var password = $("#reg-password").val();

                if((names == "") || (phone == "") ){
                    var toasts = app.toast.create({
                        text: 'All fields except password are required',
                        position: 'center',
                        closeTimeout: 3000
                    });
                    toasts.open();
                    vibration();
                    return;
                }

                app.preloader.show();

                $.ajax({
                    url: url,
                    type: 'POST',
                    timeout: 30000,
                    data: {
                        'update-profile': '',
                        'names' : names,
                        'phone': phone,
                        'password': password,
                        'user_id': sessionStorage.getItem("user_id")
                    },
                    error: function(er){
                        var toasts = app.toast.create({
                            text: 'Network error, try again',
                            position: 'center',
                            closeTimeout: 3000
                        });
                        toasts.open();
                        app.preloader.hide();
                    },
                    success: function(f){
                        app.preloader.hide();
                        sessionStorage.setItem("name",names);
                        sessionStorage.setItem("phone",phone);


                        var toasts = app.toast.create({
                            text: 'Profile Update successfully!',
                            position: 'center',
                            closeTimeout: 3000
                        });
                        toasts.open();

                    }
                });
            });
        }


        if(page.name === "my-auctions"){
	  	    isLogin();
	  	    var data = JSON.parse(sessionStorage.getItem("my_auctions"));

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
                var id = data[i].id;
                htmls += '<li>';
                htmls += '<a href="/view-bid/?title='+title+'&item_desc='+item_desc+'&category='+category+'&price='+price+'&image='+pimg+'&id='+id+'&amount='+amount+'&end_date='+end_date+'" class="item-link item-content">';
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

            $(".my-auctions").html(htmls);

        }

      if(page.name === "view-bid"){
          isLogin();

          var p = page.route.query;
          var amt = parseInt(p.amount);
          $(".ptitles").html(p.title);
          $(".bg-imgs").css("background-image","url("+p.image+")");
          $(".item-descs").html(p.item_desc);
          $(".item-prices").html(p.price);
          $(".item-categorys").html(p.category);

          if(p.highest == "null"){
              $(".highests").html("&#8358; 0");
              var highest_bid = 0;
          }else{
              $(".highests").html("&#8358; "+p.highest);
              var highest_bid = parseInt(p.highest);
          }


          $(".end-dates").html(p.end_date);


            app.dialog.progress("Loading bids submitted...");
            $.ajax({
               url: url,
               type: 'get',
               dataType: 'json',
               data: {
                   'id': p.id,
                   'view-bids': ''
               },
                timeout: 30000,
                error: function (er) {
                    app.dialog.close();
                    create_toast("Network error, try again later!");
                },
                success: function (f) {
                    app.dialog.close();
                    if(f.total == 0){
                        create_toast("No bid submitted!");
                        return;
                    }
                    var data = f.bids;
                    var htmls = "";
                    for(var i = 0; i < data.length; i++){

                        htmls += '<li>';
                        htmls += '<a href="" class="item-link item-content">';
                        htmls += '<div class="item-media data-img-li">';
                        htmls += '<i class="icon material-icons">person</i>';
                        htmls += '</div>';

                        htmls += '<div class="item-inner">';
                        htmls += '<div class="item-title">'
                        htmls += '<div class="item-header">'+data[i].phone+'</div>';
                        htmls += data[i].name+'</div>';
                        htmls += '<div class="item-after">&#8358; '+data[i].amount+'</div>';
                        htmls += '</div></div></a></li>';
                    }

                    $(".my-bids-s").html(htmls);

                }
            });


      }

      if(page.name === "bid-won"){
          isLogin();

          app.preloader.show();

          $.ajax({
              url: url,
              type: 'get',
              dataType: 'json',
              data: {
                  'load-won': '',
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
                          htmls += '<a href="" class="item-link item-content">';
                          htmls += '<div class="item-media data-img-li">';
                          htmls += '<img src="'+img+'" class="img-responsive img-circle" width="70">';
                          htmls += '</div>';
                          htmls += '<div class="item-inner">';
                          htmls += '<div class="item-title">'
                          htmls += '<div class="item-header">'+category+'</div>';
                          htmls += title+'</div>';
                          htmls += '<div class="item-after">Base Amount '+price+'</div>';
                          htmls += '<div class="item-footer">Bid AMount: &#8358; '+highest+'</div>';
                          htmls += '</div></div></a></li>';
                      }
                      $(".my-won").html(htmls);
                      //parseAuctions(data,".all-auctions");
                  }
              }
          });
      }
	    // Code for Services page
    
	});

    $$(document).on('page:reinit', function (e) {
        var page = e.detail;
        console.log("we are here...");

        if(page.name === "category"){
            isLogin();

            var cats = JSON.parse(sessionStorage.getItem("category"));
            var t = "";
            for(let i = 0; i < cats.length; i++){
                t += "<li><a href='/auction-cat/?category="+cats[i].category+"'>"+cats[i].category+"</a></li>";
            }

            $("#cat-list").html(t);
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