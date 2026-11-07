# Yakipaki

Yakipaki is an Android mobile app that is supposed to help managing packing lists. The UI should be translatable 
and one definit support should be in German.

The main functionality is the organisation of items for packing lists. This is the primary view of the app - a 
list of items that the user wants to manage. Items can be added, deleted and edited. There is one list of items per
app instance and this list together with all other data related is stored locally without any cloud addition.

An item can be assigned to different types of groupings - for startes, we know for sure that we have the two 
groupings "traveling phase" ("Reisephase"), and "category" ("Kategorie"). This all happens through a dedicated 
item editor which can be opened through a pen symbol next to every packing item.

The grouping "category" is just used to categorise items into different types like "Clothing", "Documents" etc.
These categories are managed by the user. They can add and remove such categories and assign them to packing items 
("Gegenstände"). An item can be part of multiple categories.

The grouping "traveling phase" is just to assign items to different phases of a bigger travel. A traveling phase 
has a name and a date range with a start and end date giving when this phase takes place. There are no 
restrictions for whether phases may overlap or may leave gaps.

Travel phases may additionally be collected into "travelling categories". So for example the user might want to 
collect "Trekking tea houses" and "Trekking camping" under a super category "Trekking". Also there are no 
restrictions for overlapping or gaps.

On the main screen the user should be provided with the ability to filter their packing list by category and by 
travelling phase, including the traveling categories. We want to support at least one special filters which could 
help optimizing the packing list: a list of items that are only used very shortly or never (when they are only 
assigned to a total of traveling phases of less than maybe 5 days) or items that only belong to one traveling 
phase.

One additional feature is the possibility to mark items as owned or sort of "not yet owned". The not-yet-owned 
items should be available either in yet another filter-view (if the place for selectable filters doesn't already 
fill too much screen space) or in a special "shopping list" ("Einkaufsliste") view .
