document.getElementById("btnSendCode").onclick = () => {
  const email = document.getElementById("userEmail").value;
  if (email) {
    document.getElementById("step1").style.display = "none";
    document.getElementById("step2").style.display = "block";
    document.getElementById("stepText").innerText = "Código enviado a " + email;
  } else {
    alert("Introduce tu email");
  }
};

document.getElementById("btnResetPass").onclick = () => {
  alert("Contraseña actualizada con éxito");
  window.location.href = "login.html";
};
