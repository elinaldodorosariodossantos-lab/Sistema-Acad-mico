import React, { lazy, Suspense } from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

import { Layout } from './components/Layout';

const Dashboard = lazy(() => import('./components/pages/Dashboard').then((module) => ({ default: module.Dashboard })));
const Alunos = lazy(() => import('./components/pages/Alunos').then((module) => ({ default: module.Alunos })));
const AlunoDetalhes = lazy(() => import('./components/pages/AlunoDetalhes').then((module) => ({ default: module.AlunoDetalhes })));
const Turmas = lazy(() => import('./components/pages/Turmas').then((module) => ({ default: module.Turmas })));
const Horarios = lazy(() => import('./components/pages/Horarios').then((module) => ({ default: module.Horarios })));
const Frequencia = lazy(() => import('./components/pages/Frequencia').then((module) => ({ default: module.Frequencia })));
const Relatorios = lazy(() => import('./components/pages/Relatorios').then((module) => ({ default: module.Relatorios })));
const Financeiro = lazy(() => import('./components/pages/Financeiro').then((module) => ({ default: module.Financeiro })));

export const App: React.FC = () => {

  return (

    <Router>
      <Routes>

        <Route
          path="/"
          element={
            <Layout title="Dashboard">
              <Suspense fallback={null}><Dashboard /></Suspense>
            </Layout>
          }
        />

        <Route
          path="/alunos/:id"
          element={
            <Layout title="Dados do Aluno">
              <Suspense fallback={null}><AlunoDetalhes /></Suspense>
            </Layout>
          }
        />

        <Route
          path="/alunos"
          element={
            <Layout title="Alunos">
              <Suspense fallback={null}><Alunos /></Suspense>
            </Layout>
          }
        />

        <Route
          path="/turmas"
          element={
            <Layout title="Turmas">
              <Suspense fallback={null}><Turmas /></Suspense>
            </Layout>
          }
        />

        <Route
          path="/horarios"
          element={
            <Layout title="Horários">
              <Suspense fallback={null}><Horarios /></Suspense>
            </Layout>
          }
        />

        <Route
          path="/frequencia"
          element={
            <Layout title="Frequência">
              <Suspense fallback={null}><Frequencia /></Suspense>
            </Layout>
          }
        />

        <Route
          path="/relatorios"
          element={
            <Layout title="Relatórios">
              <Suspense fallback={null}><Relatorios /></Suspense>
            </Layout>
          }
        />

        <Route
          path="/financeiro"
          element={
            <Layout title="Controle Financeiro">
              <Suspense fallback={null}><Financeiro /></Suspense>
            </Layout>
          }
        />

      </Routes>

    </Router>
  );
};
