// Sample reports data - will be populated with actual ObjectIds during seeding
const reports = [
    {
        // Will be set during seeding: reporter, reportedEntity
        entityType: 'Product',
        reason: 'Counterfeit product',
        details: 'This product appears to be a fake replica of a well-known brand. The quality is poor and misleading.',
        status: 'verified',
        actionTaken: 'Product banned',
        adminNotes: 'Verified as counterfeit. Product removed from marketplace.',
    },
    {
        entityType: 'User',
        reason: 'Harassment',
        details: 'User has been sending inappropriate messages to other sellers.',
        status: 'action_taken',
        actionTaken: 'User warned and suspended for 7 days',
        adminNotes: 'First offense. Issued warning and temporary suspension.',
    },
    {
        entityType: 'Product',
        reason: 'Misleading description',
        details: 'Product description claims handmade but appears to be mass-produced.',
        status: 'pending',
    },
    {
        entityType: 'Product',
        reason: 'Inappropriate content',
        details: 'Product images contain offensive symbols.',
        status: 'action_taken',
        actionTaken: 'Product banned permanently',
        adminNotes: 'Violated community guidelines. Permanent ban issued.',
    },
    {
        entityType: 'User',
        reason: 'Spam',
        details: 'User is posting the same product multiple times with different accounts.',
        status: 'verified',
        actionTaken: 'Account suspended pending investigation',
        adminNotes: 'Investigating multiple accounts. Temporary suspension applied.',
    },
    {
        entityType: 'Product',
        reason: 'Price manipulation',
        details: 'Seller is artificially inflating prices and then offering fake discounts.',
        status: 'dismissed',
        adminNotes: 'Investigated. Pricing is within acceptable range. No action needed.',
    },
    {
        entityType: 'User',
        reason: 'Fake reviews',
        details: 'User appears to be posting fake positive reviews on their own products.',
        status: 'pending',
    },
    {
        entityType: 'Product',
        reason: 'Prohibited item',
        details: 'Product contains materials that are not allowed on the platform.',
        status: 'action_taken',
        actionTaken: 'Product removed',
        adminNotes: 'Contains prohibited materials. Seller notified.',
    },
    {
        entityType: 'User',
        reason: 'Non-delivery',
        details: 'Multiple customers report not receiving their orders from this seller.',
        status: 'verified',
        actionTaken: 'Seller account suspended',
        adminNotes: 'Multiple non-delivery complaints. Account suspended until resolved.',
    },
    {
        entityType: 'Product',
        reason: 'Copyright infringement',
        details: 'Product uses copyrighted designs without permission.',
        status: 'pending',
    },
];

module.exports = reports;
