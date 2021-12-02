const axios = window.axios;
const form = document.getElementById("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id_no = document.getElementById("id_number").value;
  const ref_no = document.getElementById("ref_number").value;
  const button = document.getElementById("submit_button");
  const error_text = document.getElementById("error-text");

  const downloadBlob = (data, fileName) => {
    const blob = new Blob([data], {
      type: "application/pdf",
    });
    const url = window.URL.createObjectURL(blob);
    downloadURL(url, fileName);
    setTimeout(function () {
      return window.URL.revokeObjectURL(url);
    }, 1000);
  };

  const downloadURL = (data, fileName) => {
    const a = document.createElement("a");
    a.href = data;
    a.download = fileName;
    document.body.appendChild(a);
    a.style = "display: none";
    a.click();
    a.remove();
  };

  button.disabled = true;
  button.innerHTML = "Loading...";
  error_text.textContent = "";

  try {
    const response = await axios.post(
      "/generate",
      { id_no, ref_no },
      { responseType: "blob" }
    );
    button.disabled = false;
    button.innerHTML = "Generate Certificate";
    downloadBlob(response.data, id_no);
  } catch (error) {
    button.disabled = false;
    button.innerHTML = "Generate Certificate";
    error_text.textContent = "that didn't seem right";
  }
});
