// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const hbs = require('hbs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Configurar Handlebars
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Registrar helpers de Handlebars
hbs.registerHelper('eq', function(a, b, options) {
    return (a === b) ? options.fn(this) : options.inverse(this);
});

hbs.registerHelper('currentYear', function() {
    return new Date().getFullYear();
});

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // o tu proveedor de correo
    auth: {
        user: process.env.EMAIL_USER, // tu correo
        pass: process.env.EMAIL_PASS  // tu contraseña de aplicación
    }
});

// También puedes usar configuración SMTP personalizada:
/*
const transporter = nodemailer.createTransporter({
    host: 'smtp.tu-proveedor.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
*/

// Datos del template
const templateData = {
    title: "Pixel&Co",
    company_name: "Pixel&Co",
    hero_title: "Innovación Digital del Futuro",
    hero_description: "Transformamos ideas en soluciones digitales extraordinarias con tecnología de vanguardia",
    about_description: "Somos una empresa especializada en crear soluciones digitales innovadoras que impulsan el crecimiento de tu negocio. Con años de experiencia en el mercado, nos hemos consolidado como líderes en desarrollo tecnológico.",
    about_mission: "Nuestra misión es democratizar la tecnología, haciendo que las herramientas más avanzadas sean accesibles para empresas de todos los tamaños. Creemos que la innovación debe ser el motor del progreso empresarial.",
    about_image: "/images/team.jpg", // Agrega tu imagen
    footer_description: "Liderando la revolución digital con soluciones innovadoras y tecnología de vanguardia.",
    form_action: "/contact",
    current_year: new Date().getFullYear(),
    
    services: [
        {
            icon: "🚀",
            title: "Desarrollo Web",
            description: "Aplicaciones web escalables, robustas y seguras diseñadas para crecer con tu negocio. Utilizamos las últimas tecnologías para garantizar rendimiento óptimo."
        },
        {
            icon: "💳",
            title: "Sistemas POS",
            description: "Soluciones de punto de venta inteligentes que optimizan tus operaciones comerciales con análisis en tiempo real y gestión de inventarios."
        },
        {
            icon: "📱",
            title: "Publicidad Digital",
            description: "Campañas publicitarias estratégicas en redes sociales y Google Ads que maximizan tu ROI y aumentan tu presencia online."
        },
        {
            icon: "🎨",
            title: "Diseño Gráfico",
            description: "Diseños creativos y profesionales que comunican la esencia de tu marca: logos, branding, material publicitario y más."
        },
        {
            icon: "📸",
            title: "Fotografía Profesional",
            description: "Fotografía comercial y de producto que captura la calidad y esencia de tu negocio con un enfoque profesional y creativo."
        },
        {
            icon: "📊",
            title: "Marketing Digital",
            description: "Estrategias integrales de marketing digital: SEO, content marketing, email marketing y análisis de métricas para impulsar tu crecimiento."
        }
    ],
    
    stats: [
        {
            number: "150+",
            label: "Proyectos Completados"
        },
        {
            number: "50+",
            label: "Clientes Satisfechos"
        },
        {
            number: "5+",
            label: "Años de Experiencia"
        },
        {
            number: "24/7",
            label: "Soporte Técnico"
        }
    ],
    
    contact: {
        email: "info@techsolutions.com",
        phone: "+57 300 123 4567",
        address: "Popayán, Cauca, Colombia"
    },
    
    social: {
        facebook: "https://facebook.com/tu-empresa",
        instagram: "https://instagram.com/tu-empresa",
        linkedin: "https://linkedin.com/company/tu-empresa",
        twitter: "https://twitter.com/tu-empresa"
    }
};

// Rutas
app.get('/', (req, res) => {
    res.render('index', templateData);
});

// Ruta para manejar el formulario de contacto
app.post('/contact', async (req, res) => {
    try {
        const { name, email, phone, service, message } = req.body;
        
        // Validar datos
        if (!name || !email || !message || !service) {
            return res.status(400).json({
                success: false,
                message: 'Por favor completa todos los campos requeridos'
            });
        }

        // Configurar el correo para ti (notificación)
        const mailOptionsToAdmin = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
            subject: `Nuevo contacto desde el sitio web - ${service}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px;">
                    <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                        <h2 style="color: #333; text-align: center; margin-bottom: 30px;">💌 Nuevo Contacto - Pixel&Co</h2>
                        
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                            <h3 style="color: #667eea; margin-bottom: 15px;">📋 Información del Cliente</h3>
                            <p style="margin: 8px 0;"><strong>👤 Nombre:</strong> ${name}</p>
                            <p style="margin: 8px 0;"><strong>📧 Email:</strong> ${email}</p>
                            <p style="margin: 8px 0;"><strong>📱 Teléfono:</strong> ${phone || 'No proporcionado'}</p>
                            <p style="margin: 8px 0;"><strong>🛠️ Servicio:</strong> ${service}</p>
                        </div>
                        
                        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3;">
                            <h4 style="color: #1976d2; margin-bottom: 10px;">💬 Mensaje</h4>
                            <p style="color: #333; line-height: 1.6; margin: 0;">${message}</p>
                        </div>
                        
                        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                            <p style="color: #666; font-size: 14px;">
                                📅 Recibido el ${new Date().toLocaleDateString('es-CO', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            `
        };

        // Configurar el correo de confirmación al cliente
        const mailOptionsToClient = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: '✅ Hemos recibido tu mensaje - Pixel&Co',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #00f5ff, #7c3aed); padding: 20px; border-radius: 10px;">
                    <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h1 style="color: #7c3aed; margin: 0;">Pixel&Co</h1>
                            <h2 style="color: #333; margin: 10px 0;">¡Gracias por contactarnos! 🚀</h2>
                        </div>
                        
                        <p style="color: #333; font-size: 16px; line-height: 1.6;">
                            Hola <strong>${name}</strong>,
                        </p>
                        
                        <p style="color: #333; font-size: 16px; line-height: 1.6;">
                            Hemos recibido tu mensaje sobre <strong>${service}</strong> y queremos agradecerte por tu interés en nuestros servicios.
                        </p>
                        
                        <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #00f5ff;">
                            <p style="color: #333; margin: 0;">
                                <strong>🕐 ¿Qué sigue?</strong><br>
                                Nuestro equipo revisará tu solicitud y te contactaremos en las próximas 24 horas para discutir cómo podemos ayudarte a alcanzar tus objetivos digitales.
                            </p>
                        </div>
                        
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h4 style="color: #7c3aed; margin-bottom: 15px;">📞 Información de Contacto</h4>
                            <p style="margin: 5px 0; color: #333;">📧 Email: ${templateData.contact.email}</p>
                            <p style="margin: 5px 0; color: #333;">📱 Teléfono: ${templateData.contact.phone}</p>
                            <p style="margin: 5px 0; color: #333;">📍 Ubicación: ${templateData.contact.address}</p>
                        </div>
                        
                        <div style="text-align: center; margin-top: 30px;">
                            <p style="color: #666; font-size: 14px;">
                                Síguenos en redes sociales para estar al día con las últimas tendencias digitales
                            </p>
                            <div style="margin-top: 15px;">
                                <a href="${templateData.social.facebook}" style="text-decoration: none; margin: 0 10px; font-size: 20px;">📘</a>
                                <a href="${templateData.social.instagram}" style="text-decoration: none; margin: 0 10px; font-size: 20px;">📷</a>
                                <a href="${templateData.social.linkedin}" style="text-decoration: none; margin: 0 10px; font-size: 20px;">💼</a>
                            </div>
                        </div>
                        
                        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                            <p style="color: #999; font-size: 12px;">
                                © ${new Date().getFullYear()} Pixel&Co. Transformando ideas en realidad digital.
                            </p>
                        </div>
                    </div>
                </div>
            `
        };

        // Enviar correos
        await Promise.all([
            transporter.sendMail(mailOptionsToAdmin),
            transporter.sendMail(mailOptionsToClient)
        ]);

        console.log(`✅ Nuevo contacto recibido de: ${name} (${email}) - Servicio: ${service}`);

        res.json({
            success: true,
            message: '¡Mensaje enviado exitosamente! Te contactaremos pronto.'
        });

    } catch (error) {
        console.error('❌ Error al enviar correo:', error);
        res.status(500).json({
            success: false,
            message: 'Hubo un error al enviar tu mensaje. Por favor intenta nuevamente.'
        });
    }
});

// Ruta para verificar estado del servidor
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Middleware para manejar errores 404
app.use((req, res) => {
    res.status(404).render('404', { 
        title: 'Página no encontrada',
        company_name: templateData.company_name
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`
    🚀 Servidor iniciado exitosamente!
    
    📍 URL Local: http://localhost:${PORT}
    📧 Correos configurados: ${process.env.EMAIL_USER ? '✅' : '❌'}
    🕐 Tiempo de inicio: ${new Date().toLocaleString('es-CO')}
    
    💡 Para detener el servidor presiona Ctrl+C
    `);
});

// Manejo de errores del servidor
process.on('uncaughtException', (error) => {
    console.error('❌ Error no capturado:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promesa rechazada no manejada:', reason);
    process.exit(1);
});