import { useState } from 'react';
import { DatePicker, ConfigProvider, Space, Input, Button } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';
import { linkService } from './../../services/shortlinkService';
import LoginModal from './../../pages/homepage/loginModal';
import OpenGenerateLink from './openGenerateLink';
import { useAuth } from '../../contexts/AuthContext';
import { CheckCircleOutlined, RocketOutlined } from '@ant-design/icons';
import CopyToClipboard from './copyToClipboard';

const { RangePicker } = DatePicker;

const ShortUrlGenerator = () => {

  const { isAuthenticated } = useAuth();
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [shortCode, setshortCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
   const [hasDismissedLogin, setHasDismissedLogin] = useState(false); 
  const [advancedOptions, setAdvancedOptions] = useState({
    customAlias: '',
    password: '',
    expiry: null as [dayjs.Dayjs, dayjs.Dayjs] | null,
    description: ''
  });




  const handleAdvancedChange = (field: string, value: any) => {
    setAdvancedOptions(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return current && (current < dayjs().startOf('day') || current > dayjs().add(5, 'days').endOf('day'));
  };

    const handleInputFocus = () => {
     if (!isAuthenticated && !hasDismissedLogin) {
      setShowLoginModal(true);
    }
  };


  const generateShortUrl = async () => {
    // Check if user is authenticated
    // Check authentication using the context
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    if (!longUrl.trim()) {
      setError('Please enter a URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(longUrl);
    } catch (err) {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Prepare request data
      const requestData: any = {
        originalUrl: longUrl.trim()
      };

      // Add advanced options if provided
      if (advancedOptions.customAlias.trim()) {
        requestData.customAlias = advancedOptions.customAlias.trim();
      }

      if (advancedOptions.password.trim()) {
        requestData.password = advancedOptions.password.trim();
      }

      if (advancedOptions.description.trim()) {
        requestData.description = advancedOptions.description.trim();
      }

      // Handle expiry date (use end date from range)
      if (advancedOptions.expiry && advancedOptions.expiry[1]) {
        requestData.expiryDate = advancedOptions.expiry[1].toISOString();
      }

      // Call the API
      const response = await linkService.createLink(requestData);
      setShortUrl(response.shortUrl);
      setshortCode(response.shortCode);
      console.log(response)
      
    } catch (err: any) {
      if (err.message?.includes('Session expired') || err.message?.includes('401')) {
        setShowLoginModal(true);
        setError('Your session has expired. Please login again.');
      } else {
        setError(err.message || 'Failed to generate short URL');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setHasDismissedLogin(false);
    if (longUrl.trim()) {
      setTimeout(() => {
        generateShortUrl();
      }, 500);
    }
  };

  const handleLoginClose = () => {
    setShowLoginModal(false);
    setHasDismissedLogin(true);
  };

  const resetForm = () => {
    setLongUrl('');
    setShortUrl('');
    setAdvancedOptions({
      customAlias: '',
      password: '',
      expiry: null,
      description: ''
    });
    setShowAdvanced(false);
    setHasDismissedLogin(false);
  };

  const handleSwitchToSignup = () => {
    setShowLoginModal(false);
     setHasDismissedLogin(true);
    // You can add signup modal logic here
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#2563eb',
          borderRadius: 8,
        },
      }}
    >
      <div className="p-15 mx-auto mx-auto lg:p-10 mb-0 max-w-6xl">
        {/* URL Input Section */}
        {!shortUrl && (
          <div className="rounded-xl p-0 mb-0">
            <div className="space-y-4">
              {/* Main URL Input with Button */}
              <Space.Compact className="w-full" size="large">
                <Input
                  size="large"
                  placeholder="Paste your long URL here..."
                    type="url"
                    value={longUrl}
                    onChange={(e) => setLongUrl(e.target.value)}
                     onFocus={handleInputFocus}
                  className="rounded-l-xl text-md h-14 border-r-0 hover:border-blue-300 focus:border-blue-500 p-6"
                />
                <Button
                  type="primary"
                  size="large"
                  loading={loading}
                  onClick={generateShortUrl}
                //   disabled={loading || !longUrl.trim()}
                  className="h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 rounded-r-xl font-semibold text-lg px-8"
                  icon={<RocketOutlined />}
                >
                  Shorten URL
                </Button>
              </Space.Compact>  

            

              {/* Advanced Options Toggle */}
<div className="flex items-center justify-center gap-3 pt-2 text-center">
  <button
    onClick={() => setShowAdvanced(!showAdvanced)}
    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
  >
    <div className={`w-4 h-4 border border-gray-400 rounded flex items-center justify-center transition-all ${
      showAdvanced ? 'bg-blue-500 border-blue-500' : ''
    }`}>
      {showAdvanced && (
        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
    Advanced Options
  </button>
  <span className="text-xs text-gray-500">Custom URL, Password protection, and more</span>
</div>



              {/* Advanced Options Form */}
              {showAdvanced && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4 animate-fadeIn max-w-2xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Custom Alias
                      </label>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 bg-white -gray-300 rounded-l-lg px-3 padding1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 ant-btn-color-primary ant-btn-variant-solid">
                           {import.meta.env.VITE_FRONTEND_URL}
                        </span>
                        <input
                          type="text"
                          value={advancedOptions.customAlias}
                          onChange={(e) => handleAdvancedChange('customAlias', e.target.value)}
                          placeholder="custom-link"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password Protection
                      </label>
                      <input
                        type="password"
                        value={advancedOptions.password}
                        onChange={(e) => handleAdvancedChange('password', e.target.value)}
                        placeholder="Enter password (optional)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    {/* Expiry Date Range */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Active Period (Max 5 days)
                      </label>
                      <RangePicker
                        value={advancedOptions.expiry}
                        onChange={(dates) => handleAdvancedChange('expiry', dates)}
                        disabledDate={disabledDate}
                        format="YYYY-MM-DD HH:mm"
                        showTime={{
                          format: 'HH:mm',
                          defaultValue: [dayjs().startOf('day'), dayjs().endOf('day')],
                        }}
                        placeholder={['Start date', 'End date']}
                        className="w-full"
                        size="large"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        The link will be active only during this period (maximum 5 days from now)
                      </p>
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={advancedOptions.description}
                        onChange={(e) => handleAdvancedChange('description', e.target.value)}
                        placeholder="Add a description for this link (optional)"
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                      />
                    </div>

                  </div>
                </div>
              )}

              {error && (
                <div className="text-red-600 text-sm bg-red-50 px-4 py-2 rounded-lg flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm text-gray-500">
                <Space>
                  <CheckCircleOutlined className="text-green-500" />
                  <span>Manage My Links</span>
                </Space>
                <Space>
                  <CheckCircleOutlined className="text-green-500" />
                  <span>Instant shortening</span>
                </Space>
                <Space>
                  <CheckCircleOutlined className="text-green-500" />
                  <span>Secure & reliable</span>
                </Space>
              </div>              
            </div>
          </div>
        )}

        {/* Result Section */}
        {shortUrl && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-green-800 font-medium">Your shortened URL is ready!</span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                value={shortUrl}
                readOnly
                className="flex-1 px-4 py-3 bg-white border border-green-300 rounded-lg text-green-900 font-mono text-sm"
              />

            <CopyToClipboard  
                shortUrl={shortUrl} 
                shortCode={shortCode} 
              /> 

            </div>


  {/* Button Group */}
  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-green-200">
    <button
      onClick={resetForm}
      className="bg-white text-blue-600 border border-blue-300 px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 text-sm font-medium justify-center"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      Create New Link
    </button>

            <OpenGenerateLink 
                shortUrl={shortUrl} 
                shortCode={shortCode} 
              />             
  </div>
          </div>
        )}

        {/* Login Modal */}
        <LoginModal
          visible={showLoginModal}
          onClose={handleLoginClose}
          onSuccess={handleLoginSuccess}
          onSwitchToSignup={handleSwitchToSignup}
        />
      </div>
    </ConfigProvider>
  );
};

export default ShortUrlGenerator;