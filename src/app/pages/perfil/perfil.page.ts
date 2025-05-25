import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false,
})
export class PerfilPage implements OnInit {
  
  // Variables para el modal de configuración
  isSettingsModalOpen = false;
  isSupportExpanded = false;
  isFAQExpanded = false;
  isContactModalOpen = false;

  // Formulario de contacto de soporte
  supportForm = {
    name: '',
    email: '',
    type: '',
    subject: '',
    message: ''
  };

  // Lista de preguntas frecuentes
  faqList = [
    {
      question: '¿Puedo identificar plantas en diferentes etapas de crecimiento?',
      answer: 'Sí, nuestra aplicación puede identificar plantas en diversas etapas de su ciclo de vida, desde plántulas hasta plantas maduras. El sistema de reconocimiento está entrenado para detectar características distintivas en cada fase de crecimiento.',
      isExpanded: false
    },
    {
      question: '¿Puedo personalizar los recordatorios de cuidado para mis propias preferencias?',
      answer: 'Por supuesto. Puedes ajustar la frecuencia de riego, fertilización, poda y otros cuidados según tus necesidades específicas y las condiciones de tu entorno. También puedes crear recordatorios personalizados.',
      isExpanded: false
    },
    {
      question: '¿Tiene una comunidad donde puedo conectarme con otros amantes de las plantas?',
      answer: 'Sí, contamos con una comunidad activa donde puedes compartir experiencias, hacer preguntas, intercambiar consejos y conectarte con otros entusiastas de las plantas de todo el mundo.',
      isExpanded: false
    },
    {
      question: '¿Puedo compartir fotos del progreso de mis plantas con otros usuarios?',
      answer: 'Definitivamente. Puedes crear un diario visual de tus plantas y compartir el progreso con la comunidad. También puedes recibir consejos y comentarios de otros usuarios sobre el cuidado de tus plantas.',
      isExpanded: false
    },
    {
      question: '¿Cómo protege mis datos la aplicación?',
      answer: 'Tomamos muy en serio la privacidad de tus datos. Utilizamos encriptación de extremo a extremo, no compartimos información personal con terceros sin tu consentimiento, y puedes controlar qué información es visible para otros usuarios.',
      isExpanded: false
    },
    {
      question: '¿Qué tipo de datos recopila la aplicación?',
      answer: 'Recopilamos información sobre tus plantas (fotos, notas de cuidado), datos de uso de la aplicación para mejorar la experiencia, y información básica del perfil que elijas compartir. Toda la recopilación se hace con tu consentimiento explícito.',
      isExpanded: false
    }
  ];

  constructor(
    public db: DatabaseService,
  ) {}

  ngOnInit() {}

  // Funciones para el modal de configuración
  openSettingsModal() {
    this.isSettingsModalOpen = true;
  }

  closeSettingsModal() {
    this.isSettingsModalOpen = false;
    this.isSupportExpanded = false;
    this.isFAQExpanded = false;
    // Cerrar todas las preguntas FAQ
    this.faqList.forEach(faq => faq.isExpanded = false);
  }

  openContactModal() {
    this.isContactModalOpen = true;
  }

  closeContactModal() {
    this.isContactModalOpen = false;
    // Limpiar formulario
    this.supportForm = {
      name: '',
      email: '',
      type: '',
      subject: '',
      message: ''
    };
  }

  // Navegación a otras páginas
  goToNotifications() {
    // Implementar navegación a notificaciones
    console.log('Ir a notificaciones de tarea');
    // this.router.navigate(['/notifications']);
  }

  goToSubscription() {
    // Implementar navegación a suscripción
    console.log('Ir a suscripción');
    // this.router.navigate(['/subscription']);
  }

  // Funciones para el centro de soporte
  toggleSupportCenter() {
    this.isSupportExpanded = !this.isSupportExpanded;
    if (!this.isSupportExpanded) {
      this.isFAQExpanded = false;
      this.faqList.forEach(faq => faq.isExpanded = false);
    }
  }

  toggleFAQ() {
    this.isFAQExpanded = !this.isFAQExpanded;
    if (!this.isFAQExpanded) {
      this.faqList.forEach(faq => faq.isExpanded = false);
    }
  }

  toggleFAQAnswer(index: number) {
    this.faqList[index].isExpanded = !this.faqList[index].isExpanded;
  }

  contactSupport() {
    this.closeSettingsModal();
    setTimeout(() => {
      this.openContactModal();
    }, 300); // Pequeña pausa para la transición
  }

  // Validación del formulario
  isFormValid(): boolean {
    return !!(
      this.supportForm.name.trim() &&
      this.supportForm.email.trim() &&
      this.supportForm.type &&
      this.supportForm.subject.trim() &&
      this.supportForm.message.trim() &&
      this.isValidEmail(this.supportForm.email)
    );
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async sendSupportMessage() {
    if (!this.isFormValid()) {
      return;
    }

    try {
      // Aquí implementarías el envío real del mensaje
      // Por ejemplo, a través de un servicio HTTP
      console.log('Enviando mensaje de soporte:', this.supportForm);
      
      // Simular envío exitoso
      const alert = document.createElement('ion-alert');
      alert.header = 'Mensaje enviado';
      alert.message = 'Tu consulta ha sido enviada exitosamente. Te responderemos pronto.';
      alert.buttons = ['OK'];
      
      document.body.appendChild(alert);
      await alert.present();
      
      alert.addEventListener('didDismiss', () => {
        this.closeContactModal();
      });

    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      
      const alert = document.createElement('ion-alert');
      alert.header = 'Error';
      alert.message = 'Hubo un problema al enviar tu mensaje. Inténtalo de nuevo.';
      alert.buttons = ['OK'];
      
      document.body.appendChild(alert);
      await alert.present();
    }
  }
}