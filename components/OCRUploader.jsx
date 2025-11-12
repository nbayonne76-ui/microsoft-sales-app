"use client";

import React, { useState, useRef } from 'react';
import { Upload, FileImage, X, Eye, EyeOff, Loader2, CheckCircle, AlertCircle, Copy } from 'lucide-react';
import Tesseract from 'tesseract.js';

const OCRUploader = ({ onTextExtracted, className = "" }) => {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedText, setExtractedText] = useState('');
  const [showText, setShowText] = useState(false);
  const [error, setError] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [useServerOCR, setUseServerOCR] = useState(false);
  const [ocrResults, setOcrResults] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner un fichier image (JPG, PNG, GIF, etc.)');
      return;
    }

    // Vérifier la taille du fichier (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Le fichier est trop volumineux. Taille maximum : 10MB');
      return;
    }

    setError('');
    setIsProcessing(true);
    setProgress(0);
    setExtractedText('');
    setOcrResults(null);
    
    // Créer une URL pour prévisualiser l'image
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);

    try {
      if (useServerOCR) {
        await processWithServerOCR(file);
      } else {
        await processWithClientOCR(file);
      }
    } catch (err) {
      console.error('Erreur OCR:', err);
      setError('Erreur lors de l\'extraction du texte. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const processWithClientOCR = async (file) => {
    const result = await Tesseract.recognize(
      file,
      'fra+eng', // Français et anglais
      {
        logger: m => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        }
      }
    );

    const text = result.data.text.trim();
    setExtractedText(text);
    setShowText(true);
    
    // Appeler le callback avec le texte extrait
    if (onTextExtracted && text) {
      onTextExtracted(text);
    }
  };

  const processWithServerOCR = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    // Simuler un progress pour l'API
    setProgress(50);

    const response = await fetch('/api/ocr', {
      method: 'POST',
      body: formData
    });

    setProgress(100);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur serveur');
    }

    const result = await response.json();
    setExtractedText(result.text);
    setOcrResults(result);
    setShowText(true);
    
    // Appeler le callback avec le texte extrait
    if (onTextExtracted && result.text) {
      onTextExtracted(result.text);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const resetUpload = () => {
    setUploadedImage(null);
    setExtractedText('');
    setShowText(false);
    setError('');
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(extractedText);
    } catch (err) {
      console.error('Erreur copie:', err);
    }
  };

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      {!uploadedImage ? (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
          
          <div className="space-y-4">
            <div className="flex justify-center">
              <FileImage className="w-12 h-12 text-gray-400" />
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Extraire du texte d'une image
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Glissez-déposez une image ou cliquez pour sélectionner
              </p>
              
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="text-sm text-gray-600">Mode:</span>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useServerOCR}
                    onChange={(e) => setUseServerOCR(e.target.checked)}
                    className="sr-only"
                  />
                  <div className="relative">
                    <div className={`w-11 h-6 rounded-full transition-colors ${useServerOCR ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${useServerOCR ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-700">
                    {useServerOCR ? 'Serveur (analysé)' : 'Client (rapide)'}
                  </span>
                </label>
              </div>
              
              <button
                onClick={handleButtonClick}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choisir une image
              </button>
            </div>
            
            <p className="text-xs text-gray-500">
              Formats supportés: JPG, PNG, GIF, WEBP • Max 10MB
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Image prévisualisée */}
          <div className="relative">
            <img
              src={uploadedImage}
              alt="Image uploadée"
              className="w-full h-48 object-contain bg-gray-50 rounded-lg border"
            />
            <button
              onClick={resetUpload}
              className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Progress bar pendant le traitement */}
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Extraction du texte en cours...
                </span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Erreur */}
          {error && (
            <div className="flex items-center p-3 text-sm text-red-800 bg-red-50 rounded-lg border border-red-200">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Résultat */}
          {extractedText && !isProcessing && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-green-800">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Texte extrait avec succès ({extractedText.length} caractères)
                  {ocrResults?.confidence && (
                    <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                      {ocrResults.confidence}% confiance
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copier
                  </button>
                  <button
                    onClick={() => setShowText(!showText)}
                    className="flex items-center px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
                  >
                    {showText ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
                    {showText ? 'Masquer' : 'Afficher'}
                  </button>
                </div>
              </div>

              {showText && (
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <pre className="text-sm whitespace-pre-wrap text-gray-800">
                      {extractedText}
                    </pre>
                  </div>
                  
                  {/* Analyse du contenu (mode serveur) */}
                  {ocrResults?.contentAnalysis && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-900 mb-2">📊 Analyse du contenu</h4>
                      <div className="space-y-1 text-xs text-blue-800">
                        {ocrResults.contentAnalysis.type !== 'unknown' && (
                          <div>Type: <span className="font-medium">{ocrResults.contentAnalysis.type}</span></div>
                        )}
                        <div>Langue: <span className="font-medium">{ocrResults.contentAnalysis.language === 'fr' ? 'Français' : 'Anglais'}</span></div>
                        {ocrResults.contentAnalysis.businessRelevant && (
                          <div className="text-blue-700 font-medium">✅ Contenu professionnel détecté</div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Suggestions (mode serveur) */}
                  {ocrResults?.suggestions && ocrResults.suggestions.length > 0 && (
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h4 className="text-sm font-semibold text-yellow-900 mb-2">💡 Suggestions</h4>
                      <div className="space-y-1">
                        {ocrResults.suggestions.map((suggestion, idx) => (
                          <div key={idx} className="text-xs text-yellow-800">
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OCRUploader;