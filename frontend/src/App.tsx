import React from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

import { Layout } from './components/Layout';

import {
  Dashboard,
  Alunos,
  Turmas,
  Horarios,
  Frequencia,
  Relatorios,
  Financeiro
} from './components/pages';

export const App: React.FC = () => {

  return (

    <Router>

      <Routes>

        <Route
          path="/"
          element={
            <Layout title="Dashboard">
              <Dashboard />
            </Layout>
          }
        />

        <Route
          path="/alunos"
          element={
            <Layout title="Alunos">
              <Alunos />
            </Layout>
          }
        />

        <Route
          path="/turmas"
          element={
            <Layout title="Turmas">
              <Turmas />
            </Layout>
          }
        />

        <Route
          path="/horarios"
          element={
            <Layout title="Horários">
              <Horarios />
            </Layout>
          }
        />

        <Route
          path="/frequencia"
          element={
            <Layout title="Frequência">
              <Frequencia />
            </Layout>
          }
        />

        <Route
          path="/relatorios"
          element={
            <Layout title="Relatórios">
              <Relatorios />
            </Layout>
          }
        />

        <Route
          path="/financeiro"
          element={
            <Layout title="Controle Financeiro">
              <Financeiro />
            </Layout>
          }
        />

      </Routes>

    </Router>
  );
};
