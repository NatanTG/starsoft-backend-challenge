export interface PasswordResetTemplateParams {
  resetUrl: string;
}

export const passwordResetTemplate = (
  resetUrl: PasswordResetTemplateParams['resetUrl'],
): string => {
  const currentYear = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperação de Senha</title>
    <!--[if !mso]><!-->
    <style>
        /* Mobile responsiveness */
        @media only screen and (max-width: 600px) {
            .mobile-container { 
                width: 100% !important; 
                max-width: 100% !important; 
                margin: 10px !important;
            }
            .mobile-padding { 
                padding: 20px !important; 
            }
            .mobile-header-padding {
                padding: 20px 15px !important;
            }
            .mobile-title { 
                font-size: 24px !important; 
                line-height: 30px !important; 
                margin: 0 0 20px 0 !important;
            }
            .mobile-text { 
                font-size: 16px !important; 
                line-height: 22px !important; 
                margin: 0 0 16px 0 !important;
            }
            .mobile-small-text {
                font-size: 14px !important;
                line-height: 20px !important;
            }
            .mobile-button { 
                width: 100% !important; 
                padding: 16px 20px !important; 
                font-size: 16px !important;
                min-width: auto !important;
                display: block !important;
                box-sizing: border-box !important;
            }
            .mobile-button-container {
                width: 100% !important;
            }
            .mobile-icon { 
                font-size: 40px !important; 
            }
            .mobile-notice {
                padding: 16px 0 !important;
            }
            .mobile-footer {
                padding: 20px 15px !important;
            }
            .mobile-url-break {
                word-break: break-all !important;
                font-size: 13px !important;
            }
        }
        
        /* Smaller mobile devices */
        @media only screen and (max-width: 480px) {
            .mobile-container {
                margin: 5px !important;
            }
            .mobile-padding {
                padding: 15px !important;
            }
            .mobile-title {
                font-size: 22px !important;
                line-height: 28px !important;
            }
            .mobile-text {
                font-size: 15px !important;
            }
            .mobile-icon {
                font-size: 36px !important;
            }
        }
    </style>
    <!--<![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8f9fa;">
        <tr>
            <td align="center" style="padding: 10px;">
                <table class="mobile-container" role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background-color: #ffffff; max-width: 600px; width: 100%; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Content -->
                    <tr>
                        <td class="mobile-padding" style="padding: 20px 40px 40px 40px;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td align="center" style="padding: 0 0 24px 0;">
                                        <span class="mobile-icon" style="color: #f59e0b; font-size: 48px;">🔐</span>
                                    </td>
                                </tr>
                            </table>

                            <h2 class="mobile-title" style="color: #1a1a1a; font-size: 28px; font-weight: 300; margin: 0 0 24px 0; line-height: 1.2; text-align: center;">
                                Redefinir senha
                            </h2>
                            
                            <p class="mobile-text" style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0; text-align: center;">
                                Olá! Recebemos uma solicitação para redefinir a senha da sua conta. Se você fez esta solicitação, clique no botão abaixo para criar uma nova senha.
                            </p>
                            
                            <!-- Security Notice -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 24px 0; border-top: 1px solid #f0f0f0; border-bottom: 1px solid #f0f0f0;">
                                <tr>
                                    <td class="mobile-notice" style="padding: 20px 0; text-align: center;">
                                        <p class="mobile-text mobile-small-text" style="color: #dc2626; font-size: 14px; margin: 0; line-height: 1.6;">
                                            <strong>Este link expira em 1 hora</strong>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- CTA Button -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 24px 0;">
                                <tr>
                                    <td align="center">
                                        <table class="mobile-button-container" role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: auto;">
                                            <tr>
                                                <td style="background-color: #F51B31; border-radius: 6px;">
                                                    <a href="${resetUrl}" class="mobile-button" style="display: block; background-color: #F51B31; color: #ffffff; text-decoration: none; padding: 18px 40px; border-radius: 6px; font-weight: 500; font-size: 16px; text-align: center; letter-spacing: 0.5px; min-width: 200px;">
                                                        REDEFINIR SENHA
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 24px 0; border-top: 1px solid #f0f0f0;">
                                <tr>
                                    <td class="mobile-notice" style="padding: 20px 0; text-align: center;">
                                        <p class="mobile-text mobile-small-text" style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0;">
                                            Não solicitou esta alteração? Ignore este e-mail.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <p class="mobile-text mobile-small-text mobile-url-break" style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 20px 0 0 0; text-align: center;">
                                Se você não conseguir clicar no botão, copie e cole este link no seu navegador:<br>
                                <span style="color: #F51B31; word-break: break-all;">${resetUrl}</span>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td class="mobile-footer" style="padding: 24px; text-align: center; border-top: 1px solid #f0f0f0; border-radius: 0 0 8px 8px;">
                            <p class="mobile-text mobile-small-text" style="color: #9ca3af; font-size: 13px; margin: 0; line-height: 1.5;">
                                © ${currentYear} E-commerce API. Todos os direitos reservados.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;
};