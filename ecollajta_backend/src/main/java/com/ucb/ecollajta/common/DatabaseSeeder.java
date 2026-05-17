package com.ucb.ecollajta.common;

import com.ucb.ecollajta.model.events.*;
import com.ucb.ecollajta.model.CommunityPost;
import com.ucb.ecollajta.model.Reward;
import com.ucb.ecollajta.repository.events.EventRepository;
import com.ucb.ecollajta.repository.community.CommunityPostRepository;
import com.ucb.ecollajta.repository.rewards.RewardRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final EventRepository eventRepository;
    private final CommunityPostRepository communityPostRepository;
    private final RewardRepository rewardRepository;

    // Change to true to force re-seed (clears existing data)
    private static final boolean FORCE_RESEED = true;

    @Override
    public void run(String... args) throws Exception {
        try {
            seedEvents();
            seedRewards();
            seedCommunityPosts();
        } catch (Exception e) {
            log.error("Error seeding database: {}", e.getMessage(), e);
        }
    }

    // ─────────────────────────────────────────────────────────────────
    // MISSIONS / EVENTS
    // ─────────────────────────────────────────────────────────────────
    private void seedEvents() {
        if (!FORCE_RESEED && eventRepository.count() > 0) {
            log.info("Events already present (count: {}). Skipping.", eventRepository.count());
            return;
        }
        if (FORCE_RESEED) {
            eventRepository.deleteAll();
            log.info("Force re-seeding events...");
        }

        List<Event> events = List.of(

            Event.builder()
                .title("Limpieza del Río Rocha")
                .description("El Río Rocha es uno de los íconos de Cochabamba y necesita nuestra ayuda. Únete a esta brigada de limpieza ciudadana para retirar residuos sólidos de las orillas. Se proporcionarán guantes, bolsas y chalecos de seguridad. La participación otorga puntos extra de bonificación.")
                .locationName("Puente Cala Cala, Río Rocha, Cochabamba")
                .startsAt(LocalDateTime.of(2026, 6, 7, 8, 0))
                .endsAt(LocalDateTime.of(2026, 6, 7, 12, 0))
                .pointsReward(600)
                .status(EventStatus.published)
                .latitude(new BigDecimal("-17.378900"))
                .longitude(new BigDecimal("-66.159200"))
                .slotsTotal(150)
                .slotsFilled(87)
                .qrScans(74)
                .district("Distrito 2")
                .imageUrl("https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?w=800&auto=format&fit=crop")
                .build(),

            Event.builder()
                .title("Reforestación Parque La Madre")
                .description("Participaremos en la plantación de árboles nativos como el molle y el algarrobo en el emblemático Parque La Madre de Cochabamba. Los árboles son el pulmón de nuestra ciudad. Trae ropa cómoda y ganas de contribuir. Se entregará certificado de participación ecológica.")
                .locationName("Parque La Madre, Av. Ramón Rivero, Cochabamba")
                .startsAt(LocalDateTime.of(2026, 6, 14, 9, 0))
                .endsAt(LocalDateTime.of(2026, 6, 14, 13, 0))
                .pointsReward(500)
                .status(EventStatus.published)
                .latitude(new BigDecimal("-17.389200"))
                .longitude(new BigDecimal("-66.152100"))
                .slotsTotal(100)
                .slotsFilled(43)
                .qrScans(0)
                .district("Cercado")
                .imageUrl("https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop")
                .build(),

            Event.builder()
                .title("Brigada PET — Cala Cala")
                .description("Jornada de recolección y clasificación de botellas plásticas PET en el barrio Cala Cala. Cada kilogramo de PET entregado suma puntos verdes a tu cuenta. La actividad incluye un taller rápido sobre la cadena de reciclaje del plástico y su impacto en la Laguna Alalay.")
                .locationName("Punto Verde Cala Cala, Av. Blanco Galindo, Cochabamba")
                .startsAt(LocalDateTime.of(2026, 6, 21, 9, 30))
                .endsAt(LocalDateTime.of(2026, 6, 21, 14, 0))
                .pointsReward(350)
                .status(EventStatus.published)
                .latitude(new BigDecimal("-17.375000"))
                .longitude(new BigDecimal("-66.168000"))
                .slotsTotal(80)
                .slotsFilled(22)
                .qrScans(0)
                .district("Cala Cala")
                .imageUrl("https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop")
                .build(),

            Event.builder()
                .title("Taller Compostaje Comunitario — Sur")
                .description("Aprende a convertir tus residuos orgánicos domésticos en abono de alta calidad. El taller incluye demostración práctica, kit de iniciación para compostera urbana y recetario de mezclas orgánicas. Perfecto para familias que tienen jardín o macetas en casa. Apto para niños.")
                .locationName("Centro Comunitario Sur Moderno, Av. Petrolera, Cochabamba")
                .startsAt(LocalDateTime.of(2026, 6, 28, 10, 0))
                .endsAt(LocalDateTime.of(2026, 6, 28, 12, 30))
                .pointsReward(400)
                .status(EventStatus.published)
                .latitude(new BigDecimal("-17.412100"))
                .longitude(new BigDecimal("-66.143200"))
                .slotsTotal(60)
                .slotsFilled(15)
                .qrScans(0)
                .district("Distrito Sur")
                .imageUrl("https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop")
                .build(),

            Event.builder()
                .title("Reciclaje de Vidrio — Centro Histórico")
                .description("Campaña de acopio de botellas y frascos de vidrio en el corazón histórico de Cochabamba. Trae tus envases de vidrio limpios y sueltos. Por cada kg entregado sumarás puntos directamente en la app. La actividad incluye una exposición fotográfica sobre el patrimonio ambiental de la ciudad.")
                .locationName("Plaza 14 de Septiembre, Centro Histórico, Cochabamba")
                .startsAt(LocalDateTime.of(2026, 7, 5, 8, 0))
                .endsAt(LocalDateTime.of(2026, 7, 5, 16, 0))
                .pointsReward(300)
                .status(EventStatus.published)
                .latitude(new BigDecimal("-17.393500"))
                .longitude(new BigDecimal("-66.156800"))
                .slotsTotal(200)
                .slotsFilled(56)
                .qrScans(0)
                .district("Distrito 4")
                .imageUrl("https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=800&auto=format&fit=crop")
                .build(),

            Event.builder()
                .title("Misión Verde: Laguna Alalay")
                .description("La Laguna Alalay es el principal humedal urbano de Cochabamba y hogar de aves migratorias. Esta misión combina limpieza de los bordes de la laguna, plantación de totoras nativas y monitoreo de aves. Actividad técnica supervisada por biólogos del municipio. Apta para todas las edades.")
                .locationName("Laguna Alalay, Av. Uyuni, Cochabamba")
                .startsAt(LocalDateTime.of(2026, 7, 12, 7, 30))
                .endsAt(LocalDateTime.of(2026, 7, 12, 13, 0))
                .pointsReward(750)
                .status(EventStatus.published)
                .latitude(new BigDecimal("-17.400300"))
                .longitude(new BigDecimal("-66.148500"))
                .slotsTotal(120)
                .slotsFilled(98)
                .qrScans(92)
                .district("Sarco")
                .imageUrl("https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=800&auto=format&fit=crop")
                .build()
        );

        eventRepository.saveAll(events);
        log.info("✅ {} events seeded successfully.", events.size());
    }

    // ─────────────────────────────────────────────────────────────────
    // REWARDS
    // ─────────────────────────────────────────────────────────────────
    private void seedRewards() {
        if (!FORCE_RESEED && rewardRepository.count() > 0) {
            log.info("Rewards already present (count: {}). Skipping.", rewardRepository.count());
            return;
        }
        if (FORCE_RESEED) {
            rewardRepository.deleteAll();
            log.info("Force re-seeding rewards...");
        }

        List<Reward> rewards = List.of(

            buildReward(
                "Canasta Agroecológica EMAPA",
                "Canasta semanal con productos orgánicos y agroecológicos de temporada producidos por agricultores certificados del Valle Cochabambino. Incluye verduras, frutas y legumbres frescas de Punata, Cliza y Tiquipaya.",
                100, 450,
                "EMAPA Cochabamba", "Alimentos", "eco",
                "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop"
            ),

            buildReward(
                "Descuento Predial Sostenible",
                "Obtén un 15% de descuento en el pago de tus impuestos prediales anuales como reconocimiento a tu compromiso ambiental ciudadano. Válido para propiedades en el municipio de Cochabamba. Canjeable una vez por año fiscal.",
                50, 800,
                "GAMC — Municipio de Cochabamba", "Impuestos", "receipt_long",
                "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop"
            ),

            buildReward(
                "Score Verde — Banco Económico",
                "Mejora tu calificación crediticia con el sello 'Ciudadano Verde' del Banco Económico. Accede a tasas preferenciales para créditos de vivienda ecológica, paneles solares o vehículos eléctricos. Válido por 6 meses desde el canje.",
                30, 1200,
                "Banco Económico Bolivia", "Finanzas", "trending_up",
                "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop"
            ),

            buildReward(
                "Pase Mensual Pumakatari",
                "Accede durante un mes completo al Sistema Integrado de Transporte Pumakatari de Cochabamba sin costo alguno. Viaja de forma sostenible por todas las rutas del sistema y reduce tu huella de carbono personal.",
                200, 550,
                "SEMTCOBOL — Cochabamba", "Transporte", "directions_bus",
                "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop"
            ),

            buildReward(
                "Kit Solar Fotovoltaico Básico",
                "Recibe un kit de panel solar portátil de 20W + batería de 10Ah + foco LED para cargar desde energía solar. Ideal para reducir el consumo eléctrico en casa. Entrega en el Centro Tecnológico Municipal de Cochabamba.",
                15, 2500,
                "EnergíaBolivia — ENDE Cochabamba", "Tecnología", "solar_power",
                "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&auto=format&fit=crop"
            )
        );

        rewardRepository.saveAll(rewards);
        log.info("✅ {} rewards seeded successfully.", rewards.size());
    }

    private Reward buildReward(String name, String description, int stock, int pointsCost,
                                String provider, String category, String icon, String imageUrl) {
        Reward r = new Reward();
        r.setName(name);
        r.setDescription(description);
        r.setStock(stock);
        r.setPointsCost(pointsCost);
        r.setProvider(provider);
        r.setCategory(category);
        r.setIcon(icon);
        r.setImageUrl(imageUrl);
        return r;
    }

    // ─────────────────────────────────────────────────────────────────
    // COMMUNITY POSTS
    // ─────────────────────────────────────────────────────────────────
    private void seedCommunityPosts() {
        if (!FORCE_RESEED && communityPostRepository.count() > 0) {
            log.info("Community posts already present (count: {}). Skipping.", communityPostRepository.count());
            return;
        }
        if (FORCE_RESEED) {
            communityPostRepository.deleteAll();
            log.info("Force re-seeding community posts...");
        }

        CommunityPost post1 = new CommunityPost(
            null,
            "Alcaldía de Cochabamba",
            "Gobierno Autónomo Municipal",
            "account_balance",
            false,
            "HACE 2 HORAS",
            "OFICIAL",
            "feed-official",
            "¡Nuevos puntos de acopio diferenciado en 12 barrios! Estamos instalando 60 contenedores nuevos para facilitar la separación de residuos plásticos, orgánicos y de vidrio. Busca el más cercano en tu app.",
            "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800",
            342, 48, false
        );

        CommunityPost post2 = new CommunityPost(
            null,
            "Dra. María Elena Vargas",
            "Líder Ambiental — Recoleta",
            "https://i.pravatar.cc/150?img=47",
            true,
            "HACE 5 HORAS",
            "COMUNIDAD",
            "feed-community",
            "Tips de Reciclaje: Compostera Casera 🌿. ¿Sabías que el 40% de nuestra basura diaria es orgánica? 3 pasos simples:\n1. Usa un balde con tapa y orificios laterales.\n2. Alterna capas 'verdes' (restos de comida) con 'marrones' (cartón seco).\n3. Revuelve una vez por semana para airear. ¡Tu jardín te lo agradecerá!",
            null,
            1200, 156, true
        );

        communityPostRepository.saveAll(List.of(post1, post2));
        log.info("✅ Community posts seeded successfully.");
    }
}
