

// Node.js con validación adicional
import escapeHTML from 'escape-html';


export  function sanitizeHtml(input) {
    let texto = String(input);
    
    texto = texto.replace(/[\x00-\x1F\x7F]/g, '');
    
    // 3. Escapar HTML
    texto = escapeHTML(texto);
    
    if (texto.length > 10000) {
        texto = texto.substring(0, 10000);
    }
    
    return texto;
}

export function sanitizeEmail(emailInput) {
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
        throw new Error('Email inválido');
    }
    
    const emailSanitizado = sanitizeHtml(emailInput);
    
  
    //  y dejaron de ser email válido, algo raro pasó)
    if (!emailRegex.test(emailSanitizado.replace(/&[a-z]+;/g, 'a'))) {
      
        console.warn('Email sospechoso después de sanitizar');
    }
    
    return emailSanitizado;
}