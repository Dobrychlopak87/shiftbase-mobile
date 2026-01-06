import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Entry } from '../types/entry';
import { Project } from '../types/project';
import { Settings } from '../types/settings';

export const exportService = {
  async exportToJSON(entries: Entry[], projects: Project[], settings: Settings): Promise<string> {
    const data = {
      entries,
      projects,
      settings,
      exportDate: new Date().toISOString(),
      version: '1.0.0',
    };
    return JSON.stringify(data, null, 2);
  },

  async exportToCSV(entries: Entry[], projects: Project[]): Promise<string> {
    const projectMap = new Map(projects.map(p => [p.id, p]));

    const headers = ['Date', 'Start', 'End', 'Hours', 'Description', 'Project', 'Category', 'Break', 'Location', 'Notes'];
    const rows = entries.map(e => {
      const project = e.projectId ? projectMap.get(e.projectId) : null;
      return [
        e.date,
        e.startTime,
        e.endTime,
        e.hours.toFixed(2),
        `"${e.description}"`,
        project?.name || '-',
        e.category,
        e.breakTime,
        `"${e.location}"`,
        `"${e.notes}"`,
      ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  },

  async exportToWhatsApp(entries: Entry[], projects: Project[]): Promise<string> {
    const projectMap = new Map(projects.map(p => [p.id, p]));
    const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);

    let message = '📊 *Work Time Report*\n\n';
    message += `📅 Export Date: ${new Date().toLocaleDateString()}\n\n`;
    message += `*Summary*\n`;
    message += `Total Hours: *${totalHours.toFixed(2)}h*\n`;
    message += `Entries: *${entries.length}*\n\n`;

    const entriesByDate = new Map<string, Entry[]>();
    entries.forEach(e => {
      if (!entriesByDate.has(e.date)) entriesByDate.set(e.date, []);
      entriesByDate.get(e.date)!.push(e);
    });

    const sortedDates = Array.from(entriesByDate.keys()).sort().reverse();
    sortedDates.slice(0, 7).forEach(date => {
      const dayEntries = entriesByDate.get(date) || [];
      const dayHours = dayEntries.reduce((sum, e) => sum + e.hours, 0);

      message += `*${date}*\n`;
      dayEntries.forEach(e => {
        const project = e.projectId ? projectMap.get(e.projectId) : null;
        const projectInfo = project ? ` (${project.name})` : '';
        message += `• ${e.startTime}-${e.endTime}: ${e.description}${projectInfo} - ${e.hours.toFixed(2)}h\n`;
      });
      message += `_Total: ${dayHours.toFixed(2)}h_\n\n`;
    });

    return message;
  },

  async shareJSON(entries: Entry[], projects: Project[], settings: Settings): Promise<void> {
    try {
      const json = await this.exportToJSON(entries, projects, settings);
      const filename = `shiftbase-${new Date().toISOString().split('T')[0]}.json`;
      const fileUri = FileSystem.documentDirectory + filename;

      await FileSystem.writeAsStringAsync(fileUri, json);
      await Sharing.shareAsync(fileUri, { mimeType: 'application/json', UTI: 'com.json' });
    } catch (error) {
      console.error('Error sharing JSON:', error);
      throw error;
    }
  },

  async shareCSV(entries: Entry[], projects: Project[]): Promise<void> {
    try {
      const csv = await this.exportToCSV(entries, projects);
      const filename = `shiftbase-${new Date().toISOString().split('T')[0]}.csv`;
      const fileUri = FileSystem.documentDirectory + filename;

      await FileSystem.writeAsStringAsync(fileUri, csv);
      await Sharing.shareAsync(fileUri, { mimeType: 'text/csv', UTI: 'com.csv' });
    } catch (error) {
      console.error('Error sharing CSV:', error);
      throw error;
    }
  },

  async shareWhatsApp(entries: Entry[], projects: Project[]): Promise<void> {
    try {
      const message = await this.exportToWhatsApp(entries, projects);
      await Sharing.shareAsync('', { message, title: 'Work Time Report' });
    } catch (error) {
      console.error('Error sharing WhatsApp:', error);
      throw error;
    }
  },
};
