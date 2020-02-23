$(document).ready(function(){

    window.kwick="http://greenvelvet.alwaysdata.net/kwick/api/";
    logged();

});

// FONCTION DE SCROLL

    function scrolldown(){
        let chatbox = $('#ChatTopLeft');
        let height = chatbox[0].scrollHeight;
        chatbox.scrollTop(height);
    }

// QUAND "REGISTER" EST CLIQUÉ

    $("#RegistrBtn").click(function(){
        $(".MainHeader").css("display","none");
        $("#Connexion").css("display","none");
        $("#Formulaire").css("justify-content","center");
        $("#Inscription").css("display" , "inline-block");
    });
// QUAND "CANCEL" EST CLIQUÉ

    $("#CancelBtn").click(function(){
        $("#Inscription").css("display","none")
        $("#Connexion").css("display","flex")
        $(".MainHeader").css("display","flex")
        $("#Formulaire").css("justify-content","start")
    })

// QUAND "CONTINUE" EST CLIQUÉ

    $("#SignUpBtn").click(function(){
        let user_login = $("#user_login").val();
        let user_pwd = $("#user_pwd1").val();
        signup(user_login,user_pwd);
    })

// QUAND "SIGN" IN EST CLIQUÉ

    $("#SignInBtn").click(function(){
        let userlogin = $("#input_login").val();
        let userpwd = $("#input_password").val();
        signin(userlogin,userpwd);
    })

//QUAND "LOG OUT" EST CLIQUÉ

    $("#LogOutBtn").click(function(){
        console.log(window.IntervalID);
        console.log(window.IntervalID2)
        clearInterval(window.IntervalID);
        clearInterval(window.IntervalID2);
        logout();
    })

// QUAND "SEND" EST CLIQUÉ

    $("#SendBtn").click(function(){
        $('#InputField').val('');
        say();
    })

// QUAND "ENTRÉ" EST PRESSÉ

    // let SendBtn = document.getElementById("InputField");
    // SendBtn.addEventListener("keydown", say){
    //     if(event.keycode === 13)
    // } 


// FONCTION D'INSCRIPTION

    function signup(user_login, user_pwd){
        if($("#user_pwd1").val() == $("#user_pwd2").val()){
            $.ajax({
                url : window.kwick+"signup/"+user_login+"/"+user_pwd ,
                dataType: 'jsonp',
                type: 'GET',
                contentType: 'application/json; charset=utf-8',
                success: function(result, status, xhr){
                    if(result.result.status == "done"){
                        alert(result.result.message);
                        $(".MainHeader").css("display","flex");
                        $("#Connexion").css("display","flex");
                        $("#Inscription").css("display" , "none");
                        $("#Formulaire").css("justify-content","");
                        localStorage.setItem("id",result.result.id);
                        localStorage.setItem("token",result.result.token);
                        localStorage.setItem("login",user_login)
                    } else {
                        alert(result.result.message)
                        $("#user_login").css("border","red solid 4px");
                    }
                },
                error: function(xhr, status, error) {
                    alert('Error jg');
                }
            })
       }else{
           $("#user_pwd1").css("border","red solid 4px")
           $("#user_pwd2").css("border","red solid 4px")
           alert("Passwords don't match.")
       }
    };

// FONCTION DE CONNEXION

    function signin(user_login, user_pwd){
        $.ajax({
            url: window.kwick+"login/"+user_login+"/"+user_pwd,
            dataType: "jsonp",
            type: "GET",
            contentType: "application/json; charset=utf-8",
            success: function (result, status, xhr){
                alert(result.result.message);
                if(result.result.status == "done"){
                    $("#Formulaire").css("display","none");
                    $("#Chat").css("display","flex");
                    localStorage.setItem("token",result.result.token);
                    localStorage.setItem("id",result.result.id);
                    localStorage.setItem("login",user_login);
                    window.IntervalID = setInterval(logged, 10000);
                    window.IntervalID2 = setInterval(talklist, 5000);
                    console.log("Sign in ok");
                    $.ajax({
                        url: window.kwick+"talk/list/"+localStorage.getItem("token")+"/0",
                        dataType: "jsonp",
                        type: "GET",
                        contentType: "application/json; charset=utf-8",
                        success: function (result, status, xhr) {
                            window.timing = result.result.last_timestamp;
                            for(let i = 0; i<result.result.talk.length; i++){
                                $("#ChatTopRight").append(`
                                    <div class="OtherMess">
                                        <div class="PPText">
                                            <img src="lib/avatar_default.png" alt="">
                                        </div>
                                        <div class="LeftText">
                                            <div class="UpLeftText">
                                                <div class="PseudoText">
                                                    <p>${result.result.talk[i].user_name}</p>
                                                </div>
                                                <div class="Time">
                                                    <p>${result.result.talk[i].timestamp}</p>
                                                </div>
                                            </div>
                                            <div class="theMessage">
                                                <p class="Mess">${result.result.talk[i].content}</p>
                                            </div>
                                        </div>
                                    </div>`)
                            }
                        },
                        error: function (xhr, status, error) {
                            alert("Error ( TalkList Error )")
                        }
                    });
                } else {
                    if(result.result.message == "wrong password"){
                        $("#input_password").css("border","red solid 4px");
                    } else if(result.result.message == "user "+$("#input_login").val()+" unknown"){
                        $("#input_login").css("border","red solid 4px");
                    }
                }
            },
            error: function (xhr, status, error) {
                alert("Error lo")
            }
        });
    }

// FONCTION DE DÉCONNECTION

    function logout(){
        $.ajax({
            url: window.kwick+"logout/"+localStorage.getItem("token")+"/"+localStorage.getItem("id"),
            dataType: "jsonp",
            type: "GET",
            contentType: "application/json; charset=utf-8",
            success: function (result, status, xhr) {
                if(result.result.status == "done"){
                    localStorage.removeItem("token");
                    localStorage.removeItem("id");
                    localStorage.removeItem("login");
                    $("#Chat").css("display","none");
                    $("#Connexion").css("display","flex");
                    $("#Formulaire").css("display","flex");
                    alert("You are disconnected");
                } else {
                    alert(result.result.message)
                }
            },
            error: function (xhr, status, error) {
                alert("Error ni")
            }
        });
    }

// FONCTION LOGGED

    function logged(){
        $.ajax({
            url: window.kwick+"user/logged/"+localStorage.getItem("token"),
            dataType: "jsonp",
            type: "GET",
            contentType: "application/json; charset=utf-8",
            success: function (result, status, xhr) {
                $(".UserConnect").remove()
                console.log(result)
                for(let i = 0; i<result.result.user.length; i++){
                    if(result.result.user[i] != localStorage.getItem("login")){
                        $("#ChatTopLeft").append(`
                        <div class="UserConnect">
                        <div class="ProfileP">
                        <img src="lib/avatar_default.png" alt="">
                        </div>
                        <div class="Pseudo">
                        <p>${result.result.user[i]}</p>
                        </div>
                        </div>`);
                    } else {
                        $("#ChatTopLeft").append(`
                        <div class="UserConnect">
                        <div class="ProfileP">
                        <img src="lib/avatar_default.png" alt="">
                        </div>
                        <div class="Pseudo">
                        <p>${result.result.user[i]} ( Vous )</p>
                        </div>
                        </div>`);
                    }
                
                }
            },
            error: function (xhr, status, error) {
                alert("Error ye ");
            }
        });
    }

// FONCTION TALK LIST 

    function talklist(){
        
        $.ajax({
            url: window.kwick+"talk/list/"+localStorage.getItem("token")+"/"+String(window.timing),
            dataType: "jsonp",
            type: "GET",
            contentType: "application/json; charset=utf-8",
            success: function (result, status, xhr) {
                console.log(result)
                if(result.result.status == "done"){
                    if(result.result.talk.length > 0){
                        window.timing = result.result.last_timestamp;
                        scrolldown();
                        for(let i = 0; i<result.result.talk.length; i++){
                            if(result.result.talk.user_name != localStorage.getItem("login")){
                                $("#ChatTopRight").append(`
                                    <div class="OtherMess">
                                        <div class="PPText">
                                            <img src="lib/avatar_default.png" alt="">
                                        </div>
                                    <div class="LeftText">
                                        <div class="UpLeftText">
                                            <div class="PseudoText">
                                                <p>${result.result.talk[i].user_name}</p>
                                            </div>
                                            <div class="Time">
                                                <p>${result.result.talk[i].timestamp}</p>
                                            </div>
                                        </div>
                                        <div class="theMessage">
                                            <p class="Mess">${result.result.talk[i].content}</p>
                                        </div>
                                    </div>
                                </div>`);
                            } else {
                                $("#ChatTopRight").append(`
                                <div class="MyMess">
                                    <div class="MyMessLeft">
                                        <div class="UpRightText">
                                            <div class="MyLogin">
                                                <p>${result.result.talk[i].user_name}</p>
                                            </div>
                                            <div class="MyMessTime">
                                                <p>${result.result.talk[i].timestamp}</p>
                                            </div>
                                        </div>
                                        <div class="MyMessage">
                                            <p>${result.result.talk[i].content}</p>
                                        </div>
                                    </div>
                                    <div class="MyMessRight">
                                        <img src="lib/avatar_default.png" alt="">
                                    </div>
                                </div>`);
                            }
                        }
                    }    
                } else {
                    alert(result.result.message)
                }
            },
            error: function (xhr, status, error) {
                alert("Error yo")
            }
            
        });
    }

// FONCTION SAY

    function say(){
        $.ajax({
            url: window.kwick+"say/"+localStorage.getItem("token")+"/"+localStorage.getItem("id")+"/"+encodeURIComponent($("#InputField").val()),
            dataType: "jsonp",
            type: "GET",
            contentType: "application/json; charset=utf-8",
            success: function (result, status, xhr) {
                console.log(result)
            },
            error: function (xhr, status, error) {
                alert("Error po")
            }
        })
    }
