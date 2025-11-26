class NotificationService {
  public get permission(): NotificationPermission {
    if (!('Notification' in window)) {
      return 'denied';
    }
    return Notification.permission;
  }

  public async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      // eslint-disable-next-line no-console
      console.warn('This browser does not support desktop notification');
      return 'denied';
    }
    return await Notification.requestPermission();
  }

  public sendNotification(title: string, body?: string, icon?: string) {
    if (this.permission !== 'granted') return;

    try {
      const notification = new Notification(title, {
        body,
        icon,
        silent: false,
      });

      setTimeout(() => notification.close(), 5000);

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error sending notification', e);
    }
  }
}

export const notificationService = new NotificationService();
