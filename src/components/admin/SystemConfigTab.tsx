import React, { useState } from 'react';
import { Settings, Save, RotateCcw, Download, Upload } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAdminConfig } from '../../contexts/AdminConfigContext';
import { DEFAULT_ADMIN_CONFIG } from '../../types/admin';

const SystemConfigTab = () => {
  const { config, updateSystem } = useAdminConfig();
  const [editingSystem, setEditingSystem] = useState(config.system);

  const handleSave = () => {
    updateSystem(editingSystem);
  };

  const resetToDefaults = () => {
    if (confirm('هل تريد إعادة تعيين إعدادات النظام؟')) {
      setEditingSystem(DEFAULT_ADMIN_CONFIG.system);
    }
  };

  const updateField = (updates: Partial<typeof editingSystem>) => {
    setEditingSystem(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-podcast-gold" />
          <div>
            <h3 className="text-lg font-semibold text-right">إعدادات النظام</h3>
            <p className="text-sm text-podcast-gray text-right">
              تخصيص إعدادات النظام العامة والأمان
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetToDefaults}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <RotateCcw className="w-4 h-4 ml-1" />
            إعادة تعيين
          </Button>
          <Button
            onClick={handleSave}
            size="sm"
            className="bg-podcast-gold hover:bg-podcast-gold-dark text-white"
          >
            <Save className="w-4 h-4 ml-1" />
            حفظ التغييرات
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Language Settings */}
        <div className="p-4 border border-podcast-border rounded-lg">
          <h4 className="font-medium mb-4 text-right">إعدادات اللغة</h4>
          <div>
            <Label className="text-right">لغة الواجهة</Label>
            <Select 
              value={editingSystem.language} 
              onValueChange={(language) => updateField({ language })}
            >
              <SelectTrigger className="text-right">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ar" className="text-right">العربية</SelectItem>
                <SelectItem value="en" className="text-right">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="p-4 border border-podcast-border rounded-lg">
          <h4 className="font-medium mb-4 text-right">إعدادات المظهر</h4>
          <div>
            <Label className="text-right">نمط المظهر</Label>
            <Select 
              value={editingSystem.theme} 
              onValueChange={(theme) => updateField({ theme })}
            >
              <SelectTrigger className="text-right">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default" className="text-right">افتراضي</SelectItem>
                <SelectItem value="dark" className="text-right">داكن</SelectItem>
                <SelectItem value="light" className="text-right">فاتح</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* System Preferences */}
        <div className="p-4 border border-podcast-border rounded-lg">
          <h4 className="font-medium mb-4 text-right">تفضيلات النظام</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  checked={editingSystem.autoBackup}
                  onCheckedChange={(checked) => updateField({ autoBackup: !!checked })}
                />
                <Label>تفعيل النسخ الاحتياطي التلقائي</Label>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  checked={editingSystem.debugMode}
                  onCheckedChange={(checked) => updateField({ debugMode: !!checked })}
                />
                <Label>تفعيل وضع التطوير (Debug Mode)</Label>
              </div>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="p-4 border border-podcast-border rounded-lg bg-gray-50">
          <h4 className="font-medium mb-4 text-right">معلومات النظام</h4>
          <div className="space-y-2 text-sm text-podcast-gray">
            <div className="flex justify-between">
              <span>إصدار النظام:</span>
              <span>{config.version}</span>
            </div>
            <div className="flex justify-between">
              <span>آخر تحديث:</span>
              <span>{new Date(config.lastUpdated).toLocaleString('ar-SA')}</span>
            </div>
            <div className="flex justify-between">
              <span>نمط التشغيل:</span>
              <span>{editingSystem.debugMode ? 'التطوير' : 'الإنتاج'}</span>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="p-4 border border-podcast-border rounded-lg">
          <h4 className="font-medium mb-4 text-right">إدارة البيانات</h4>
          <div className="space-y-3">
            <div className="text-sm text-podcast-gray text-right mb-3">
              يمكنك تصدير أو استيراد إعدادات النظام للنسخ الاحتياطي أو النقل
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <Download className="w-4 h-4 ml-1" />
                تصدير البيانات
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <Upload className="w-4 h-4 ml-1" />
                استيراد البيانات
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="text-sm text-yellow-700">
          <p className="font-medium mb-2">تنبيه مهم</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>تغيير إعدادات النظام قد يؤثر على أداء التطبيق</li>
            <li>تأكد من عمل نسخة احتياطية قبل إجراء تغييرات كبيرة</li>
            <li>وضع التطوير قد يعرض معلومات حساسة في وحدة التحكم</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SystemConfigTab;
