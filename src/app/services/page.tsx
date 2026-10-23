'use client';

import React, { useState, useMemo } from 'react';
import { Compass, Search, ExternalLink, MapPin, FileText, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/lib/providers';
import { servicesData } from '@/lib/demo-data';

const categoryKeys = ['all', 'education', 'welfare', 'disaster', 'health', 'transport', 'identity', 'community'] as const;

export default function ServicesPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categoryLabels: Record<string, string> = {
    all: t.services.allCategories,
    education: t.services.education,
    welfare: t.services.welfare,
    disaster: t.services.disaster,
    health: t.services.health,
    transport: t.services.transport,
    identity: t.services.identity,
    community: t.services.community,
  };

  const filteredServices = useMemo(() => {
    return servicesData.filter(service => {
      const matchesCategory = activeCategory === 'all' || service.category === activeCategory;
      const matchesSearch = !searchQuery ||
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '32px 24px 80px' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <Compass size={22} style={{ color: 'var(--accent-600)' }} />
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {t.services.title}
          </h1>
        </div>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          {t.services.subtitle}
        </p>
      </div>

      {/* Search & Filter */}
      <div style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input
            className="input"
            type="search"
            placeholder={t.services.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: 38 }}
            aria-label={t.services.search}
          />
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {categoryKeys.map((key) => (
            <button
              key={key}
              className={`btn btn-sm ${activeCategory === key ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveCategory(key)}
              style={{ fontSize: 13 }}
            >
              {categoryLabels[key]}
            </button>
          ))}
        </div>
      </div>

      {/* Demo notice */}
      <div className="demo-banner" style={{ marginBottom: 20 }}>
        <AlertCircle size={14} />
        <span>All entries below are sample data sourced from known official websites. Verify current information directly on official portals.</span>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <Search size={32} style={{ color: 'var(--text-tertiary)', margin: '0 auto 12px' }} />
          <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>{t.common.noResults}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {filteredServices.map((service) => (
            <div key={service.id} className="card card-hover" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span className="badge badge-teal" style={{ fontSize: 11 }}>
                  {categoryLabels[service.category] || service.category}
                </span>
                {service.isDemo && (
                  <span className="badge badge-amber" style={{ fontSize: 10 }}>
                    {t.services.demoLabel}
                  </span>
                )}
              </div>

              <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
                {service.name}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12, flex: 1 }}>
                {service.description}
              </p>

              {/* Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-tertiary)' }}>
                  <MapPin size={12} />
                  {service.region}
                </div>
                {service.eligibility && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 12, color: 'var(--text-tertiary)' }}>
                    <FileText size={12} style={{ marginTop: 2, flexShrink: 0 }} />
                    <span>{t.services.eligibility}: {service.eligibility}</span>
                  </div>
                )}
                {service.requiredDocuments && service.requiredDocuments.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 2 }}>
                    {service.requiredDocuments.slice(0, 3).map((doc, i) => (
                      <span key={i} className="badge badge-gray" style={{ fontSize: 10 }}>{doc}</span>
                    ))}
                    {service.requiredDocuments.length > 3 && (
                      <span className="badge badge-gray" style={{ fontSize: 10 }}>+{service.requiredDocuments.length - 3} more</span>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--border-light)' }}>
                <a
                  href={service.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: 12 }}
                >
                  <ExternalLink size={12} />
                  {t.services.visitWebsite}
                </a>
                {service.lastChecked && (
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                    {t.services.lastChecked}: {service.lastChecked}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
