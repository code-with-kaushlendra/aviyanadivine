document.addEventListener("DOMContentLoaded",function(){

const form=document.getElementById("forgotPasswordForm").addEventListener("submit",function(e){
 e.preventDefault();

 const email=document.getElementById("email").value;

 fetch("https://aviyanadivine-4.onrender.com/api/auth/forgotpassword",{
 method:"POST",
 headers:{
 "Content-Type":"application/json",
 },
 body:JSON.stringify({email:email})
 })
 .then(response=> response.json())
 .then(data=>{
 if(data.success){
 alert("Reset link sent to your email!");
 }
 else{
 alert(data.message|| "Email  not found");
 }
 })

 .catch(error=> {
 console.error("Error:",error);
 alert("Something went wrong. Please Try again ");
 });


});

})