import api from "./api";

export async function extrairDadosDaNota(arquivo) {
  const formData = new FormData();
  formData.append("arquivo", arquivo);

  const res = await api.post("/nota-fiscal/ocr", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

  return res.data;
}
