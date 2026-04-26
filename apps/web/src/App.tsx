import { useCallback, useEffect, useState } from 'react';
import type { Rule } from '@blb/shared';
import { loadRules, saveRules } from './storage.js';
import { RuleForm } from './components/RuleForm.js';
import { RuleList } from './components/RuleList.js';
import { JsonOutput } from './components/JsonOutput.js';
import { IpTester } from './components/IpTester.js';

export function App() {
  const [rules, setRules] = useState<Rule[]>(() => loadRules());
  const [invalidId, setInvalidId] = useState<string | null>(null);

  useEffect(() => {
    saveRules(rules);
  }, [rules]);

  const addRule = useCallback((rule: Rule) => {
    setRules((prev) => [...prev, rule]);
  }, []);

  const deleteRule = useCallback((id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return (
    <div className="app">
      <header>
        <h1>Block List Builder</h1>
        <p className="muted">
          Build a Node.js <code>net.BlockList</code> in the browser. Rules persist in localStorage.
        </p>
      </header>

      <section className="panel">
        <h2>Add rule</h2>
        <RuleForm onAdd={addRule} />
      </section>

      <section className="panel">
        <h2>Rules ({rules.length})</h2>
        <RuleList rules={rules} invalidId={invalidId} onDelete={deleteRule} />
      </section>

      <JsonOutput rules={rules} onInvalidRule={setInvalidId} />

      <IpTester rules={rules} />
    </div>
  );
}
