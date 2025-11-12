"use client";

import React from 'react';
import FuturisticPartnerDisplay from '../../components/FuturisticPartnerDisplay';

const DemoPartnersPage = () => {
  const partnersData = {
    category: 'MODERNWORK',
    totalCount: 20,
    partners: [
      {
        name: 'Adista',
        id: '1019430',
        specializations: ['Security', 'Cloud Endpoints', 'Modernize with Surface', 'Secure Productivity'],
        score: 4,
        maxScore: 5,
        tier: 'Premium'
      },
      {
        name: 'Be Cloud',
        id: '3519836',
        specializations: ['Security', 'Cloud Endpoints', 'Modernize with Surface', 'Secure Productivity', 'Converged Communications'],
        score: 5,
        maxScore: 5,
        tier: 'Elite'
      },
      {
        name: 'EFISENS',
        id: '1977957',
        specializations: ['Security', 'Cloud Endpoints', 'Modernize with Surface', 'Secure Productivity', 'Converged Communications'],
        score: 5,
        maxScore: 5,
        tier: 'Elite'
      },
      {
        name: 'Exakis Nelite',
        id: '1162046',
        specializations: ['Security', 'Cloud Endpoints', 'Modernize with Surface', 'Secure Productivity'],
        score: 4,
        maxScore: 5,
        tier: 'Premium'
      },
      {
        name: 'Projetlys',
        id: '1507756',
        specializations: ['Security', 'Cloud Endpoints', 'Modernize with Surface', 'Secure Productivity'],
        score: 4,
        maxScore: 5,
        tier: 'Premium'
      },
      {
        name: 'SCRIBA',
        id: '1105053',
        specializations: ['Security', 'Cloud Endpoints', 'Modernize with Surface', 'Secure Productivity'],
        score: 4,
        maxScore: 5,
        tier: 'Premium'
      },
      {
        name: 'Bechtle',
        id: '1019353',
        specializations: ['Converged Communications', 'Modernize with Surface'],
        score: 2,
        maxScore: 5,
        tier: 'Standard'
      },
      {
        name: 'COSMO CONSULT Group',
        id: '3278383',
        specializations: ['Secure Productivity'],
        score: 1,
        maxScore: 5,
        tier: 'Standard'
      },
      {
        name: 'Crayon',
        id: '1129016',
        specializations: ['Cloud Endpoints', 'Modernize with Surface', 'Secure Productivity'],
        score: 3,
        maxScore: 5,
        tier: 'Premium'
      },
      {
        name: 'Devoteam',
        id: '4557302',
        specializations: ['Modernize with Surface'],
        score: 1,
        maxScore: 5,
        tier: 'Standard'
      },
      {
        name: 'Dynamips',
        id: '1054907',
        specializations: ['Security', 'Cloud Endpoints', 'Modernize with Surface', 'Secure Productivity'],
        score: 4,
        maxScore: 5,
        tier: 'Premium'
      },
      {
        name: 'ELIADIS',
        id: '1688055',
        specializations: ['Security'],
        score: 1,
        maxScore: 5,
        tier: 'Standard'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black p-4">
      <div className="max-w-7xl mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Démonstration Interface Futuriste
          </h1>
          <p className="text-gray-400 text-lg">
            Nouvelle présentation des partenaires avec design moderne et interactif
          </p>
        </div>

        <FuturisticPartnerDisplay partnersData={partnersData} />

        <div className="mt-12 bg-black/30 rounded-xl p-6 border border-cyan-500/20">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">Fonctionnalités</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg p-4 border border-cyan-500/30">
              <h3 className="text-cyan-400 font-semibold mb-2">🎨 Design Futuriste</h3>
              <p className="text-gray-300 text-sm">Interface avec effets de glow, dégradés et animations fluides</p>
            </div>
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/30">
              <h3 className="text-green-400 font-semibold mb-2">🔍 Recherche & Filtres</h3>
              <p className="text-gray-300 text-sm">Recherche en temps réel et filtrage par niveau</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-lg p-4 border border-purple-500/30">
              <h3 className="text-purple-400 font-semibold mb-2">📊 Visualisation</h3>
              <p className="text-gray-300 text-sm">Scores visuels, barres de progression et badges colorés</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPartnersPage;