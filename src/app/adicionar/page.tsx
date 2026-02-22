"use client";

import { useState } from "react";
import styles from "./page.module.css";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function CadastroCandidato() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    genero: "Masculino",
    estado: false,
    cargo: "",
    telefone: "",
    email: "",
    nif: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payloadCandidato = {
        nome: formData.nome,
        genero: formData.genero,
        estado: formData.estado,
        cargo: formData.cargo
      };

      const payloadCredencial = {
        telefone: formData.telefone,
        email: formData.email,
        nif: formData.nif
      };

      await axios.post("https://zencode-api-tk96.onrender.com/zencode/API/candidato", payloadCandidato);
      await axios.post("https://zencode-api-tk96.onrender.com/zencode/API/credencia", payloadCredencial);
      
      router.push("/");
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Erro ao salvar os dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.cabecario}>
        <h1>ZenCode</h1>
        <p>Novo Candidato</p>
      </header>

      <nav className={styles.nav}>
        <ul>
          <li><a href="/">Voltar para Listagem</a></li>
        </ul>
      </nav>

      <main className={styles.destaque}>
        <div className={styles.containerForm}>
          <div className={styles.tituloSecao}>
            <h2>Cadastrar Novo Candidato</h2>
          </div>

          <form onSubmit={handleSubmit} className={styles.formulario}>
            <section className={styles.formGroup}>
              <h3>Dados Pessoais</h3>
              <div className={styles.gridInput}>
                <div className={styles.field}>
                  <label>Nome Completo</label>
                  <input type="text" name="nome" required value={formData.nome} onChange={handleChange} placeholder="Nome e Apelido" />
                </div>
                <div className={styles.field}>
                  <label>Gênero</label>
                  <select name="genero" value={formData.genero} onChange={handleChange}>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label>Cargo Pretendido</label>
                  <input type="text" name="cargo" required value={formData.cargo} onChange={handleChange} placeholder="Ex: Desenvolvedor Frontend" />
                </div>
              </div>
            </section>

            <section className={styles.formGroup}>
              <h3>Credenciais e Contato</h3>
              <div className={styles.gridInput}>
                <div className={styles.field}>
                  <label>E-mail</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="exemplo@email.com" />
                </div>
                <div className={styles.field}>
                  <label>Telefone</label>
                  <input type="tel" name="telefone" required value={formData.telefone} onChange={handleChange} placeholder="923..." />
                </div>
                <div className={styles.field}>
                  <label>NIF</label>
                  <input type="text" name="nif" required value={formData.nif} onChange={handleChange} placeholder="Número de Identificação Fiscal" />
                </div>
              </div>
            </section>

            <div className={styles.acoes}>
              <button type="button" onClick={() => router.back()} className={styles.btnCancelar}>Cancelar</button>
              <button type="submit" disabled={loading} className={styles.btnSalvar}>
                {loading ? "Salvando..." : "Finalizar Cadastro"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className={styles.footer}>
        © 2026 Feito por Edgar Alexandre
      </footer>
    </div>
  );
}