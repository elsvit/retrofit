import filter from 'redux-storage-decorator-filter';

export default engine => filter(engine,
    [
        'whitelisted-key',
        ['User'],
        ['Retrofit'],
        ['ValveSizer'],
        ['Projects'],
        ['form', 'ValveSizerSettingsForm'],
        ['Version'],
        ['Settings']
    ],
    [
        'blacklisted-key',
        ['Cache'],
        ['ValveSizer', 'Combinations'],
        ['ValveSizer', 'Series'],
        ['ValveSizer', 'Products']
    ]
);
