import { ChoiceGroup, SelectField } from "./fields";
import type { FormModel } from "./form-model";

type Props = { model: FormModel; err: (name: string) => string | undefined; optionalLabel: string };

/** Précisions du projet (type, région, phase, échéancier, budget, logiciels), toutes facultatives. */
export function DetailFields({ model, err, optionalLabel }: Props) {
  const { t, options } = model;
  const common = { optionalLabel };
  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField {...common} name="projectType" label={t.projectType} placeholder={t.choose} options={options.projectType} error={err("projectType")} />
        <SelectField {...common} name="region" label={t.region} placeholder={t.choose} options={options.region} error={err("region")} />
        <SelectField {...common} name="phase" label={t.phase} placeholder={t.choose} options={options.phase} error={err("phase")} />
        <SelectField {...common} name="timeline" label={t.timeline} placeholder={t.choose} options={options.timeline} error={err("timeline")} />
        {model.showBudget && <SelectField {...common} name="budget" label={t.budget} placeholder={t.choose} options={options.budget} error={err("budget")} />}
      </div>
      <ChoiceGroup {...common} name="software" type="checkbox" label={t.software} options={options.software} error={err("software")} />
    </div>
  );
}
