import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { to, subject, content, from } = await request.json();
    
    console.log('📧 Email sending request received:', { to, subject, from });
    
    if (!to || !subject || !content) {
      return Response.json({ 
        error: 'Missing required fields: to, subject, content' 
      }, { status: 400 });
    }

    // Configuration SMTP (utilisant Gmail comme exemple)
    // En production, ces credentials devraient être dans des variables d'environnement
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com', // À configurer
        pass: process.env.EMAIL_PASS || 'your-app-password'     // À configurer
      }
    });

    // Options de l'email
    const mailOptions = {
      from: from || process.env.EMAIL_USER || 'nicolas.bayonne@microsoft.com',
      to: to,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            ${content.split('\n').map(line => {
              if (line.trim().startsWith('•')) {
                return `<li style="margin: 8px 0;">${line.trim().substring(1).trim()}</li>`;
              }
              if (line.trim().startsWith('✨') || line.trim().startsWith('💰') || 
                  line.trim().startsWith('🛡️') || line.trim().startsWith('📈') ||
                  line.trim().startsWith('🎯') || line.trim().startsWith('⚡') ||
                  line.trim().startsWith('💡') || line.trim().startsWith('🔧')) {
                return `<div style="margin: 12px 0; padding: 8px; background: #f8f9fa; border-radius: 4px;">${line}</div>`;
              }
              return line.trim() ? `<p style="margin: 12px 0;">${line}</p>` : '<br>';
            }).join('')}
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
              <p>Email envoyé via l'application Nicolas Email Generator</p>
            </div>
          </div>
        </div>
      `,
      text: content // Version texte brut en fallback
    };

    // Envoyer l'email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully:', info.messageId);
    
    // Tracker l'envoi d'email dans les analytics
    try {
      const trackResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/api/analytics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'track_email_sent',
          data: {
            to,
            subject,
            messageId: info.messageId,
            contentLength: content.length,
            timestamp: new Date().toISOString()
          }
        })
      });
      
      const trackResult = await trackResponse.json();
      console.log('📊 Email sending tracked:', trackResult);
    } catch (trackError) {
      console.warn('⚠️ Analytics tracking failed:', trackError.message);
    }

    return Response.json({
      success: true,
      messageId: info.messageId,
      message: 'Email envoyé avec succès !',
      to,
      subject
    });

  } catch (error) {
    console.error('❌ Error sending email:', error);
    
    // Gestion des erreurs spécifiques
    let errorMessage = 'Erreur lors de l\'envoi de l\'email';
    
    if (error.code === 'EAUTH') {
      errorMessage = 'Erreur d\'authentification email. Vérifiez vos credentials.';
    } else if (error.code === 'ENOTFOUND') {
      errorMessage = 'Erreur de connexion au serveur email.';
    } else if (error.responseCode === 535) {
      errorMessage = 'Authentification refusée. Vérifiez votre mot de passe d\'application.';
    }
    
    return Response.json({ 
      error: errorMessage,
      details: error.message,
      code: error.code 
    }, { status: 500 });
  }
}