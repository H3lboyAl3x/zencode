"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import axios from "axios";
import Link from "next/link";

interface Candidato {
  id: number;
  nome: string;
  cargo: string;
  email: string;
  telefone: string;
  nif: string;
}

export default function Home() {
  const [listaCandidatos, setListaCandidatos] = useState<Candidato[]>([]);
  const [processo, setprocesso] = useState(true);

  const carregarDados = async () => {
    try {
      setprocesso(true);
      const resCandidatos = await axios.get("https://zencode-api-tk96.onrender.com/zencode/API/candidato");
      const resCredencias = await axios.get("https://zencode-api-tk96.onrender.com/zencode/API/credencia");

      const Combinar: Candidato[] = resCandidatos.data
        .filter((cand: any) => cand.estado === true) 
        .map((cand: any) => {
          
          const credencial = resCredencias.data.find(
            (cred: any) => cred.id === cand.id
          );

          return {
            id: cand.id,
            nome: cand.nome || "Nome não informado",
            cargo: cand.cargo || "Cargo não informado",
            email: credencial?.email || "Email não informado",
            telefone: credencial?.telefone || "Telefone não informado",
            nif: credencial?.nif || "NIF não informado",
          };
        });

      setListaCandidatos(Combinar);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setprocesso(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.cabecario}>
        <h1>ZenCode</h1>
        <p>Gerenciador de Candidatos</p>
      </header>

      <nav className={styles.nav}>
        <ul>
          <li><a href="/">Pendentes</a></li>
          <li><a href="#" className={styles.active}>Aceites</a></li>
        </ul>
      </nav>

      <main className={styles.destaque}>
        <div className={styles.tituloSecao}>
          <h2>Candidatos Aceites</h2>
          <button onClick={carregarDados} className={styles.btnAtualizar}>Atualizar</button>
        </div>

        {processo ? (
          <div className={styles.loading}>Carregando lista...</div>
        ) : (
          <div className={styles.cards}>
            {listaCandidatos.map((item, index) => (
              <div key={index} className={styles.card}>
                <div className={styles.badge}>{item.cargo}</div>
                  <h3>{item.nome}</h3>
                  <div className={styles.info}>
                      <p><strong>Email:</strong> {item.email}</p>
                      <p><strong>Tel:</strong> {item.telefone}</p>
                      <p><strong>NIF:</strong> {item.nif}</p>
                  </div>
                  <Link href={`/analizar/${item.id}`} className={styles.btnPerfil}>Ver Perfil</Link>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        © 2026 Feito por Edgar Alexandre
      </footer>
    </div>
  );
}