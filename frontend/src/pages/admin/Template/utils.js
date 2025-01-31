const templateFields = [
    'disableEditor',
    'httpAdminRoot',
    'codeEditor',
    'palette_allowInstall',
    'palette_nodesExcludes',
    'modules_allowInstall'
]
const defaultTemplateValues = {
    disableEditor: false,
    httpAdminRoot: '',
    codeEditor: 'monaco',
    palette_allowInstall: true,
    palette_nodesExcludes: '',
    modules_allowInstall: true
}

const templateValidators = {
    httpAdminRoot: (v) => {
        if (!/^[0-9a-z_\-\\/]*$/i.test(v)) {
            return 'Must contain only 0-9 a-z _ - /'
        }
    },
    palette_nodesExcludes: (v) => {
        if (v.trim() === '') { return }
        const parts = v.split(',').map(fn => fn.trim()).filter(fn => fn.length > 0)
        for (let i = 0; i < parts.length; i++) {
            const fn = parts[i]
            if (!/^[a-z0-9\-._]+\.js$/i.test(fn)) {
                return 'Must be a comma-separated list of .js filenames'
            }
        }
    }
}

function getTemplateValue (template, path) {
    const parts = path.split('_')
    let p = template
    while (parts.length > 0) {
        const part = parts.shift()
        if (p[part] === undefined) {
            return
        } else {
            p = p[part]
        }
    }
    return p
}

function setTemplateValue (template, path, value) {
    const parts = path.split('_')
    let p = template
    while (parts.length > 1) {
        const part = parts.shift()
        if (p[part] === undefined) {
            p[part] = {}
        }
        p = p[part]
    }
    const lastPart = parts.shift()
    p[lastPart] = value
}

function prepareTemplateForEdit (template) {
    const result = {
        editable: {
            name: '',
            active: false,
            description: '',
            settings: {},
            policy: {},
            changed: {
                name: false,
                description: false,
                settings: {},
                policy: {}
            },
            errors: {}
        },
        original: {
            name: '',
            active: false,
            description: '',
            settings: {},
            policy: {}
        }
    }

    result.editable.name = template.name
    result.original.name = template.name
    result.editable.changed.name = false

    result.editable.active = template.active
    result.original.active = template.active
    result.editable.changed.active = false

    result.editable.description = template.description
    result.original.description = template.description
    result.editable.changed.description = false

    result.editable.errors = {}

    templateFields.forEach(field => {
        const templateValue = getTemplateValue(template.settings, field)
        if (templateValue !== undefined) {
            result.editable.settings[field] = templateValue
            result.original.settings[field] = templateValue
        } else {
            result.editable.settings[field] = defaultTemplateValues[field]
            result.original.settings[field] = defaultTemplateValues[field]
        }
        result.editable.changed.settings[field] = false

        const policyValue = getTemplateValue(template.policy, field)
        if (policyValue !== undefined) {
            result.editable.policy[field] = policyValue
            result.original.policy[field] = policyValue
        } else {
            // By default, policy should be to lock values
            result.editable.policy[field] = false
            result.original.policy[field] = false
        }
        result.editable.changed.policy[field] = false
    })

    return result
}

export {
    getTemplateValue,
    setTemplateValue,
    defaultTemplateValues,
    templateFields,
    templateValidators,
    prepareTemplateForEdit
}
