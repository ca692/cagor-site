/**
 * Google Apps Script - Collecte des demandes d'attestation CAGOR
 *
 * INSTRUCTIONS DE DÉPLOIEMENT :
 * 1. Va sur https://script.google.com avec ton compte ca@cagor.net
 * 2. Crée un nouveau projet (+ Nouveau projet)
 * 3. Colle ce code dans l'éditeur
 * 4. Clique sur "Déployer" > "Nouveau déploiement"
 * 5. Type = "Application Web"
 * 6. Exécuter en tant que = "Moi"
 * 7. Accès = "Tout le monde"
 * 8. Clique "Déployer" et copie l'URL générée
 * 9. Colle cette URL dans le fichier index.template.html
 *    à la ligne : const APPS_SCRIPT_URL = 'COLLE_ICI';
 */

// Configuration - Nom de la feuille Google Sheets
const SHEET_NAME = 'Demandes Attestations CAGOR';
const EMAIL_NOTIFICATION = 'ca@cagor.net';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Ouvrir ou créer le Google Sheet
    let ss = getOrCreateSpreadsheet();
    let sheet = ss.getSheetByName('Demandes') || ss.insertSheet('Demandes');

    // Créer les en-têtes si c'est la première ligne
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'N° Demande',
        'Date/Heure',
        'Nom Complet',
        'CIN',
        'Téléphone',
        'Email',
        'Adresse',
        'Province',
        'Profession',
        'Membre CAGOR',
        'Destination',
        'Autre Destination',
        'Pièce Justificative',
        'Observations',
        'Statut',
        'Fichier Joint'
      ]);
      // Formater les en-têtes
      sheet.getRange(1, 1, 1, 16).setFontWeight('bold').setBackground('#0A3D2E').setFontColor('#FFFFFF');
      sheet.setFrozenRows(1);
    }

    // Générer le numéro de demande
    const numDemande = 'ATT-' + Utilities.formatDate(new Date(), 'Africa/Casablanca', 'yyyyMMdd') + '-' + String(sheet.getLastRow()).padStart(4, '0');

    // Sauvegarder le fichier joint si présent
    let fileLink = '';
    if (data.file && data.file.length > 0) {
      try {
        const fileBlob = Utilities.newBlob(
          Utilities.base64Decode(data.file.split(',')[1] || data.file),
          'application/octet-stream',
          'attestation_' + numDemande + '.pdf'
        );
        const folder = getOrCreateFolder('Pièces Jointes Attestations');
        const file = folder.createFile(fileBlob);
        fileLink = file.getUrl();
      } catch (fileError) {
        fileLink = 'Erreur upload: ' + fileError.message;
      }
    }

    // Ajouter la ligne de données
    sheet.appendRow([
      numDemande,
      Utilities.formatDate(new Date(), 'Africa/Casablanca', 'dd/MM/yyyy HH:mm'),
      data.nom || '',
      data.cin || '',
      data.telephone || '',
      data.email || '',
      data.adresse || '',
      data.province || '',
      data.profession || '',
      data.membreCagor || '',
      data.destination || '',
      data.autreDestination || '',
      data.pieceJustificative || '',
      data.observations || '',
      'En attente',
      fileLink
    ]);

    // Envoyer notification par email
    if (EMAIL_NOTIFICATION) {
      MailApp.sendEmail({
        to: EMAIL_NOTIFICATION,
        subject: '📋 Nouvelle demande d\'attestation - ' + numDemande,
        htmlBody: `
          <h2 style="color:#0A3D2E;">Nouvelle demande d'attestation</h2>
          <p><strong>N° Demande :</strong> ${numDemande}</p>
          <p><strong>Nom :</strong> ${data.nom || 'N/A'}</p>
          <p><strong>CIN :</strong> ${data.cin || 'N/A'}</p>
          <p><strong>Téléphone :</strong> ${data.telephone || 'N/A'}</p>
          <p><strong>Destination :</strong> ${data.destination || 'N/A'}</p>
          <p><strong>Province :</strong> ${data.province || 'N/A'}</p>
          <hr>
          <p><a href="${ss.getUrl()}">📊 Voir dans Google Sheets</a></p>
        `
      });
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      numDemande: numDemande
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput('Service Attestations CAGOR - Actif ✅');
}

// Obtenir ou créer le Google Sheet
function getOrCreateSpreadsheet() {
  const files = DriveApp.getFilesByName(SHEET_NAME);
  if (files.hasNext()) {
    return SpreadsheetApp.open(files.next());
  }
  const ss = SpreadsheetApp.create(SHEET_NAME);
  Logger.log('Google Sheet créé : ' + ss.getUrl());
  return ss;
}

// Obtenir ou créer un dossier Google Drive
function getOrCreateFolder(folderName) {
  const folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.createFolder(folderName);
}
