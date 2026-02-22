"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./page.module.css";
import axios from "axios";

interface DetalhesCandidato {
  id: number;
  nome: string;
  cargo: string;
  genero: string;
  estado: boolean;
  email: string;
  telefone: string;
  nif: string;
}

export default function AnaliseCandidato() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();
  const [candidato, setCandidato] = useState<DetalhesCandidato | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buscarDetalhes = async () => {
      try {
        const resCandidatos = await axios.get("https://zencode-api-tk96.onrender.com/zencode/API/candidato");
        const resCredencias = await axios.get("https://zencode-api-tk96.onrender.com/zencode/API/credencia");
        

        setCandidato({
          ...resCandidatos.data,
          email: resCredencias.data.email,
          telefone: resCredencias.data.telefone,
          nif: resCandidatos.data.nif
        });
      } catch (err) {
        console.error("Erro ao buscar detalhes", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) buscarDetalhes();
  }, [id]);

  const contratar = async() => {
    const response = await axios.get(`https://zencode-api-tk96.onrender.com/zencode/API/candidato/${id}`);
    await axios.put(`https://zencode-api-tk96.onrender.com/zencode/API/candidato/${id}`, {
      nome: response.data.nome,
      genero: response.data.genero,
      estado: true,
      cargo: response.data.cargo,
    })
    router.back();
  }

  const eliminar = async() => {
    await axios.delete(`https://zencode-api-tk96.onrender.com/zencode/API/credencia/${id}`);
    await axios.delete(`https://zencode-api-tk96.onrender.com/zencode/API/candidato/${id}`);
    router.back();
  }

  if (loading) return <div className={styles.loading}>Analisando perfil...</div>;
  if (!candidato) return <div className={styles.erro}>Candidato não encontrado.</div>;

  return (
    <div className={styles.page}>
      <header className={styles.cabecario}>
        <h1>ZenCode</h1>
        <p>Análisar de Perfil</p>
      </header>

      <main className={styles.conteudo}>
        <button onClick={() => router.back()} className={styles.btnVoltar}>
          ← Voltar para a lista
        </button>

        <div className={styles.painel}>
          <div className={styles.topoPainel}>
            <div className={styles.avatar}>
               {candidato.nome.charAt(0)}
            </div>
            <div>
              <h2>{candidato.nome}</h2>
              <span className={styles.statusBadge}>
                {candidato.estado ? "Ativo no Processo" : "Inativo"}
              </span>
            </div>
          </div>

          <div className={styles.gridInfo}>
            <section className={styles.sessao}>
              <h3>Profissional</h3>
              <p><strong>Cargo:</strong> {candidato.cargo}</p>
              <p><strong>Gênero:</strong> {candidato.genero}</p>
            </section>

            <section className={styles.sessao}>
              <h3>Contato</h3>
              <p><strong>Email:</strong> {candidato.email}</p>
              <p><strong>Telefone:</strong> {candidato.telefone}</p>
            </section>

            <section className={styles.sessao}>
              <h3>Documentação</h3>
              <p><strong>NIF:</strong> {candidato.nif}</p>
              <p><strong>ID Interno:</strong> #{candidato.id}</p>
            </section>
          </div>
          {candidato.estado === true ? (
              <button className={styles.btnRejeitar} onClick={eliminar}>Descartar</button>
          ) : (
            <>
              <button className={styles.btnRejeitar} onClick={eliminar}>Descartar</button>
              <button className={styles.btnAtualizar} onClick={contratar}>Contratar</button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}