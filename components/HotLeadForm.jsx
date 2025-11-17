'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2, Save, X } from 'lucide-react';

export default function HotLeadForm({ onSuccess, onCancel, initialData = null, leadId = null }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Informations générales
    companyName: initialData?.companyName || '',
    description: initialData?.description || '',
    address: initialData?.address || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    website: initialData?.website || '',
    employeeCount: initialData?.employeeCount || '',

    // Informations légales et financières
    legalForm: initialData?.legalForm || '',
    capitalSocial: initialData?.capitalSocial || '',
    siret: initialData?.siret || '',
    tvaNumber: initialData?.tvaNumber || '',
    nafCode: initialData?.nafCode || '',
    creationDate: initialData?.creationDate || '',
    closingDate: initialData?.closingDate || '',
    turnover: initialData?.turnover || '',

    // Statut
    isOpportunity: initialData?.isOpportunity || false,
    priority: initialData?.priority || 'MOYENNE',
    status: initialData?.status || 'active',

    // Relations
    managers: initialData?.managers || [],
    teamMembers: initialData?.teamMembers || [],
    services: initialData?.services || [],
    specialties: initialData?.specialties || [],
    solutions: initialData?.solutions || [],
    interactions: initialData?.interactions || [],
    actions: initialData?.actions || []
  });

  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addItem = (field, defaultItem) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], defaultItem]
    }));
  };

  const updateItem = (field, index, key, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      )
    }));
  };

  const removeItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () {
    if (!formData.companyName) {
      alert('Le nom de l\'entreprise est requis');
      return;
    }

    setLoading(true);

    try {
      const isUpdating = leadId || initialData?.id;
      const url = '/api/hot-leads';
      const method = isUpdating ? 'PUT' : 'POST';
      const payload = isUpdating ? { ...formData, id: leadId || initialData.id } : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        alert(isUpdating ? 'Lead mis à jour avec succès !' : 'Lead créé avec succès !');
        if (onSuccess) onSuccess(result.lead);
      } else {
        alert('Erreur: ' + (result.error || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de ' + (leadId || initialData?.id ? 'la mise à jour' : 'la création') + ' du lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {initialData ? 'Modifier le Hot Lead' : 'Nouveau Hot Lead'}
        </h1>
        <div className="flex gap-2">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>
          )}
        </div>
      </div>

      {/* Navigation steps */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
        {[
          { num: 1, label: 'Infos générales' },
          { num: 2, label: 'Légal & Financier' },
          { num: 3, label: 'Équipe' },
          { num: 4, label: 'Services & Expertises' },
          { num: 5, label: 'Solutions Microsoft' },
          { num: 6, label: 'Interactions & Actions' }
        ].map(step => (
          <button
            key={step.num}
            onClick={() => setCurrentStep(step.num)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              currentStep === step.num
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {step.num}. {step.label}
          </button>
        ))}
      </div>

      {/* Step 1: Informations générales */}
      {currentStep === 1 && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Informations générales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nom de l'entreprise *</label>
              <Input
                value={formData.companyName}
                onChange={(e) => updateField('companyName', e.target.value)}
                placeholder="KARUM Actions Nature"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Site web</label>
              <Input
                value={formData.website}
                onChange={(e) => updateField('website', e.target.value)}
                placeholder="https://karum.fr"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={3}
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Description de l'entreprise..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Adresse</label>
              <Input
                value={formData.address}
                onChange={(e) => updateField('address', e.target.value)}
                placeholder="350, route de La Bétaz, 73390 Chamoux-sur-Gelon"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Téléphone</label>
              <Input
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+33 (0)4 79 84 34 88"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="contact@entreprise.fr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nombre d'employés</label>
              <Input
                type="number"
                value={formData.employeeCount}
                onChange={(e) => updateField('employeeCount', e.target.value)}
                placeholder="22"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Priorité</label>
              <select
                className="w-full p-2 border rounded-md"
                value={formData.priority}
                onChange={(e) => updateField('priority', e.target.value)}
              >
                <option value="HAUTE">HAUTE</option>
                <option value="MOYENNE">MOYENNE</option>
                <option value="BASSE">BASSE</option>
              </select>
            </div>
          </div>
        </Card>
      )}

      {/* Step 2: Informations légales et financières */}
      {currentStep === 2 && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Informations légales et financières</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Forme juridique</label>
              <Input
                value={formData.legalForm}
                onChange={(e) => updateField('legalForm', e.target.value)}
                placeholder="SARL, SAS, SA..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Capital social</label>
              <Input
                value={formData.capitalSocial}
                onChange={(e) => updateField('capitalSocial', e.target.value)}
                placeholder="10 000 €"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">SIRET</label>
              <Input
                value={formData.siret}
                onChange={(e) => updateField('siret', e.target.value)}
                placeholder="123 456 789 00012"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">N° TVA</label>
              <Input
                value={formData.tvaNumber}
                onChange={(e) => updateField('tvaNumber', e.target.value)}
                placeholder="FR 12 345678901"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Code NAF</label>
              <Input
                value={formData.nafCode}
                onChange={(e) => updateField('nafCode', e.target.value)}
                placeholder="6201Z"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date de création</label>
              <Input
                value={formData.creationDate}
                onChange={(e) => updateField('creationDate', e.target.value)}
                placeholder="1er janvier 2000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date de clôture</label>
              <Input
                value={formData.closingDate}
                onChange={(e) => updateField('closingDate', e.target.value)}
                placeholder="31 décembre"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Chiffre d'affaires</label>
              <Input
                value={formData.turnover}
                onChange={(e) => updateField('turnover', e.target.value)}
                placeholder="1,5M €"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Step 3: Équipe */}
      {currentStep === 3 && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Dirigeants et équipe</h2>

          {/* Dirigeants */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Dirigeants</h3>
              <Button
                size="sm"
                onClick={() => addItem('managers', { name: '', role: '', email: '', phone: '' })}
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Ajouter
              </Button>
            </div>
            {formData.managers.map((manager, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-2 p-3 bg-gray-50 rounded">
                <Input
                  placeholder="Nom"
                  value={manager.name}
                  onChange={(e) => updateItem('managers', index, 'name', e.target.value)}
                />
                <Input
                  placeholder="Fonction"
                  value={manager.role}
                  onChange={(e) => updateItem('managers', index, 'role', e.target.value)}
                />
                <Input
                  placeholder="Email"
                  value={manager.email}
                  onChange={(e) => updateItem('managers', index, 'email', e.target.value)}
                />
                <Input
                  placeholder="Téléphone"
                  value={manager.phone}
                  onChange={(e) => updateItem('managers', index, 'phone', e.target.value)}
                />
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => removeItem('managers', index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Membres de l'équipe */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Membres de l'équipe</h3>
              <Button
                size="sm"
                onClick={() => addItem('teamMembers', { name: '', role: '', expertise: '' })}
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Ajouter
              </Button>
            </div>
            {formData.teamMembers.map((member, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2 p-3 bg-gray-50 rounded">
                <Input
                  placeholder="Nom"
                  value={member.name}
                  onChange={(e) => updateItem('teamMembers', index, 'name', e.target.value)}
                />
                <Input
                  placeholder="Rôle"
                  value={member.role}
                  onChange={(e) => updateItem('teamMembers', index, 'role', e.target.value)}
                />
                <Input
                  placeholder="Expertise"
                  value={member.expertise}
                  onChange={(e) => updateItem('teamMembers', index, 'expertise', e.target.value)}
                />
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => removeItem('teamMembers', index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Step 4: Services & Expertises */}
      {currentStep === 4 && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Services et expertises</h2>

          {/* Services */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Services</h3>
              <Button
                size="sm"
                onClick={() => addItem('services', { name: '', description: '' })}
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Ajouter
              </Button>
            </div>
            {formData.services.map((service, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2 p-3 bg-gray-50 rounded">
                <Input
                  placeholder="Nom du service"
                  value={service.name}
                  onChange={(e) => updateItem('services', index, 'name', e.target.value)}
                />
                <Input
                  placeholder="Description"
                  value={service.description}
                  onChange={(e) => updateItem('services', index, 'description', e.target.value)}
                />
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => removeItem('services', index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Spécialités */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Spécialités et expertises</h3>
              <Button
                size="sm"
                onClick={() => addItem('specialties', { name: '', domain: '' })}
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Ajouter
              </Button>
            </div>
            {formData.specialties.map((specialty, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2 p-3 bg-gray-50 rounded">
                <Input
                  placeholder="Spécialité"
                  value={specialty.name}
                  onChange={(e) => updateItem('specialties', index, 'name', e.target.value)}
                />
                <Input
                  placeholder="Domaine"
                  value={specialty.domain}
                  onChange={(e) => updateItem('specialties', index, 'domain', e.target.value)}
                />
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => removeItem('specialties', index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Step 5: Solutions Microsoft */}
      {currentStep === 5 && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Solutions Microsoft recommandées</h2>
          <div className="flex items-center justify-between mb-3">
            <Button
              onClick={() => addItem('solutions', {
                name: '',
                priority: 'MOYENNE',
                price: '',
                benefits: [],
                useCases: [],
                implementation: ''
              })}
            >
              <PlusCircle className="w-4 h-4 mr-1" />
              Ajouter une solution
            </Button>
          </div>
          {formData.solutions.map((solution, index) => (
            <div key={index} className="mb-4 p-4 bg-gray-50 rounded">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <Input
                  placeholder="Nom de la solution"
                  value={solution.name}
                  onChange={(e) => updateItem('solutions', index, 'name', e.target.value)}
                />
                <select
                  className="p-2 border rounded-md"
                  value={solution.priority}
                  onChange={(e) => updateItem('solutions', index, 'priority', e.target.value)}
                >
                  <option value="HAUTE">Priorité HAUTE</option>
                  <option value="MOYENNE">Priorité MOYENNE</option>
                  <option value="BASSE">Priorité BASSE</option>
                </select>
                <Input
                  placeholder="Prix"
                  value={solution.price}
                  onChange={(e) => updateItem('solutions', index, 'price', e.target.value)}
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">Bénéfices (un par ligne)</label>
                <textarea
                  className="w-full p-2 border rounded-md"
                  rows={3}
                  placeholder="Bénéfice 1&#10;Bénéfice 2&#10;Bénéfice 3"
                  value={Array.isArray(solution.benefits) ? solution.benefits.join('\n') : ''}
                  onChange={(e) => updateItem('solutions', index, 'benefits', e.target.value.split('\n').filter(b => b.trim()))}
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">Cas d'usage (un par ligne)</label>
                <textarea
                  className="w-full p-2 border rounded-md"
                  rows={3}
                  placeholder="Cas d'usage 1&#10;Cas d'usage 2&#10;Cas d'usage 3"
                  value={Array.isArray(solution.useCases) ? solution.useCases.join('\n') : ''}
                  onChange={(e) => updateItem('solutions', index, 'useCases', e.target.value.split('\n').filter(u => u.trim()))}
                />
              </div>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => removeItem('solutions', index)}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Supprimer
              </Button>
            </div>
          ))}
        </Card>
      )}

      {/* Step 6: Interactions & Actions */}
      {currentStep === 6 && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Interactions et actions à suivre</h2>

          {/* Interactions */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Interactions / Timeline</h3>
              <Button
                size="sm"
                onClick={() => addItem('interactions', {
                  date: new Date().toISOString().split('T')[0],
                  type: 'meeting',
                  title: '',
                  notes: '',
                  participants: ''
                })}
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Ajouter
              </Button>
            </div>
            {formData.interactions.map((interaction, index) => (
              <div key={index} className="mb-3 p-3 bg-gray-50 rounded">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                  <Input
                    type="date"
                    value={interaction.date}
                    onChange={(e) => updateItem('interactions', index, 'date', e.target.value)}
                  />
                  <select
                    className="p-2 border rounded-md"
                    value={interaction.type}
                    onChange={(e) => updateItem('interactions', index, 'type', e.target.value)}
                  >
                    <option value="meeting">Réunion</option>
                    <option value="call">Appel</option>
                    <option value="email">Email</option>
                    <option value="note">Note</option>
                  </select>
                  <Input
                    placeholder="Titre"
                    value={interaction.title}
                    onChange={(e) => updateItem('interactions', index, 'title', e.target.value)}
                  />
                </div>
                <textarea
                  className="w-full p-2 border rounded-md mb-2"
                  rows={2}
                  placeholder="Notes de l'interaction..."
                  value={interaction.notes}
                  onChange={(e) => updateItem('interactions', index, 'notes', e.target.value)}
                />
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => removeItem('interactions', index)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Supprimer
                </Button>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Actions à suivre</h3>
              <Button
                size="sm"
                onClick={() => addItem('actions', {
                  action: '',
                  priority: 'MOYENNE',
                  deadline: '',
                  status: 'pending',
                  assignedTo: 'Nicolas BAYONNE'
                })}
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Ajouter
              </Button>
            </div>
            {formData.actions.map((action, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-2 p-3 bg-gray-50 rounded">
                <Input
                  placeholder="Action"
                  value={action.action}
                  onChange={(e) => updateItem('actions', index, 'action', e.target.value)}
                  className="md:col-span-2"
                />
                <select
                  className="p-2 border rounded-md"
                  value={action.priority}
                  onChange={(e) => updateItem('actions', index, 'priority', e.target.value)}
                >
                  <option value="HAUTE">HAUTE</option>
                  <option value="MOYENNE">MOYENNE</option>
                  <option value="BASSE">BASSE</option>
                </select>
                <Input
                  placeholder="Deadline"
                  value={action.deadline}
                  onChange={(e) => updateItem('actions', index, 'deadline', e.target.value)}
                />
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => removeItem('actions', index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Navigation buttons */}
      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="outline"
          disabled={currentStep === 1}
          onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
        >
          ← Précédent
        </Button>

        <div className="flex gap-2">
          {currentStep < 6 ? (
            <Button onClick={() => setCurrentStep(prev => Math.min(6, prev + 1))}>
              Suivant →
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Enregistrement...' : 'Enregistrer le lead'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
